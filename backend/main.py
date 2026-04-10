from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import instagrapi
from instagrapi.exceptions import (
    ClientError,
    PrivateError,
    MediaNotFound,
)
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Instagram Downloader API")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class MediaRequest(BaseModel):
    url: str


class MediaResponse(BaseModel):
    videoUrl: str
    title: str


@app.get("/")
def health_check():
    return {"status": "ok", "message": "Instagram Downloader API is running"}


@app.post("/api/download", response_model=MediaResponse)
async def download_media(request: MediaRequest):
    """
    Download Instagram media (post, reel, story)
    Args:
        url: Instagram URL (e.g., https://instagram.com/p/ABC123)
    Returns:
        videoUrl: Direct download link
        title: Filename
    """
    try:
        url = request.url.strip()
        
        if not url or "instagram.com" not in url:
            raise HTTPException(status_code=400, detail="Invalid Instagram URL")
        
        logger.info(f"Downloading: {url}")
        
        # Create client (no login required for public content)
        client = instagrapi.Client()
        
        # Extract media ID from URL
        try:
            media_pk = instagrapi.extract_pk_from_media_url(url)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Could not parse URL: {str(e)}")
        
        # Get media info
        try:
            media = client.media_info(media_pk)
        except PrivateError:
            raise HTTPException(status_code=403, detail="Post is private or from a private account")
        except MediaNotFound:
            raise HTTPException(status_code=404, detail="Post not found")
        except ClientError as e:
            raise HTTPException(status_code=400, detail=f"Instagram error: {str(e)}")
        
        # Extract video URL
        if media.media_type == 2:  # Video (post or reel)
            download_url = media.video_url
        elif media.media_type == 8:  # Album (carousel) - get first video if it exists
            if media.resources and len(media.resources) > 0:
                first = media.resources[0]
                if first.media_type == 2:  # Is video
                    download_url = first.video_url
                else:
                    raise HTTPException(status_code=400, detail="First item in album is not a video")
            else:
                raise HTTPException(status_code=400, detail="Album has no downloadable content")
        elif media.media_type == 1:  # Photo
            raise HTTPException(status_code=400, detail="Photos cannot be downloaded as video. Only videos, reels, and video albums are supported.")
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported media type: {media.media_type}")
        
        if not download_url:
            raise HTTPException(status_code=400, detail="Could not extract download URL from media")
        
        # Generate filename
        caption = media.caption[:50] if media.caption else "instagram_video"
        caption = "".join(c for c in caption if c.isalnum() or c in (' ', '-', '_'))
        filename = f"{caption}.mp4"
        
        logger.info(f"Successfully prepared download: {filename}")
        
        return MediaResponse(videoUrl=download_url, title=filename)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
