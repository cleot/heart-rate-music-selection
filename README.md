# Heart Rate Music Selector

Demo: [https://heart-rate-music-selection.clemens.page](https://heart-rate-music-selection.clemens.page)

![Heart Rate Music Selector](preview.png)

A dynamic music player that automatically selects and queues songs from Spotify playlists based on your heart rate. The application adapts your music to your workout intensity in real-time.

![Demo](demo.png)

## Overview

This application connects to both a heart rate monitor (via Bluetooth) and Spotify to create a seamless workout experience. It automatically selects and queues songs that match your current exercise intensity based on your heart rate.

### Core Features

- **Heart Rate Monitoring**: Connects to Bluetooth heart rate monitors to track your current BPM
- **Dynamic Zone Detection**: Automatically categorizes your activity into three intensity zones:
  - Slow Zone (0-100 BPM)
  - Medium Zone (100-120 BPM)
  - Fast Zone (120-160 BPM)
- **Spotify Integration**: Automatically queues songs from different playlists based on your current heart rate zone
- **Auto DJ**: Intelligently queues songs that match your current workout intensity
- **Test Mode**: Includes a heart rate simulator slider for testing different scenarios

### Technical Architecture

#### Frontend Components

1. **HeartRateDisplay**
   - Displays current heart rate and zone information
   - Shows visual indicators for different intensity zones
   - Includes Auto DJ toggle functionality

2. **BluetoothConnect**
   - Manages Bluetooth device connection
   - Handles heart rate monitor pairing
   - Provides real-time heart rate updates

3. **NowPlaying**
   - Shows currently playing track information
   - Displays upcoming song with its corresponding zone
   - Provides playback controls (play/pause, skip)

4. **PlaylistManager**
   - Manages Spotify playlist configuration
   - Allows setting different playlists for each heart rate zone
   - Validates and displays playlist information

#### Core Logic

1. **Heart Rate Processing**
   - Continuously monitors heart rate data
   - Determines current activity zone
   - Triggers playlist changes when crossing zone boundaries

2. **Spotify Integration**
   - Handles Spotify authentication
   - Manages playlist fetching and track queueing
   - Controls playback state

3. **Queue Management**
   - Selects appropriate songs based on current zone
   - Manages the "Up Next" functionality
   - Handles automatic song queueing

### Technologies Used

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: 
  - Tailwind CSS for responsive design
  - shadcn/ui for UI components
- **State Management**: React Query for API state
- **APIs and Integration**:
  - Web Bluetooth API for heart rate monitoring
  - Spotify Web API for music playback
- **Authentication**: OAuth 2.0 for Spotify integration

### Project Structure

```
src/
├── components/           # React components
│   ├── BluetoothConnect # Bluetooth connection handling
│   ├── HeartRateDisplay # Heart rate visualization
│   ├── NowPlaying      # Music player interface
│   └── PlaylistManager # Playlist configuration
├── hooks/               # Custom React hooks
│   ├── usePlaybackControls   # Spotify playback logic
│   ├── useQueueManagement    # Song queue handling
│   └── useSpotifyConnection  # Spotify authentication
├── utils/               # Utility functions
│   ├── heartRateZones  # Zone calculation logic
│   └── spotify         # Spotify API helpers
└── pages/              # Application pages
```

## Getting Started

### Prerequisites

- Node.js & npm installed
- A Spotify Premium account
- A Bluetooth heart rate monitor (optional - includes test mode)

### Development Setup

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Configuration

1. Connect your heart rate monitor via Bluetooth
2. Authenticate with Spotify
3. Configure playlists for each zone:
   - Slow (0-100 BPM)
   - Medium (100-120 BPM)
   - Fast (120-160 BPM)
4. Enable Auto DJ to start automatic song selection

## Deployment

Simply open [Lovable](https://lovable.dev/projects/abfaf641-f5cb-4f96-bc61-db0264d20436) and click on Share -> Publish.

For custom domain deployment, we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.