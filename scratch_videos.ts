import { TikTokService } from './src/services/TikTokService.js';

async function testGetVideos() {
  console.log("Calling TikTokService.getVideos('tech.vaseegrah')...");
  const videos = await TikTokService.getVideos("tech.vaseegrah");
  console.log("Videos returned count:", videos.length);
  console.log("Videos Payload:", JSON.stringify(videos, null, 2));
}

testGetVideos().catch(console.error);
