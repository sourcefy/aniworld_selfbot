module.exports = {
    low:    { name: 'Niedrig (480p)',  width: 854,  height: 480,  frameRate: 30, bitrateVideo: 1500, bitrateVideoMax: 2500,  h26xPreset: 'ultrafast', bitrateAudio: 96,  probesize: 32  },
    medium: { name: 'Mittel (720p)',   width: 1280, height: 720,  frameRate: 60, bitrateVideo: 3500, bitrateVideoMax: 5000,  h26xPreset: 'veryfast',  bitrateAudio: 128, probesize: 48  },
    high:   { name: 'Hoch (1080p)',    width: 1920, height: 1080, frameRate: 60, bitrateVideo: 6000, bitrateVideoMax: 9000,  h26xPreset: 'veryfast',  bitrateAudio: 160, probesize: 64  },
    ultra:  { name: 'Ultra (1080p+)',  width: 1920, height: 1080, frameRate: 60, bitrateVideo: 8000, bitrateVideoMax: 12000, h26xPreset: 'faster',    bitrateAudio: 192, probesize: 128 },
};