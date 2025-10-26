# Chrome Extension - SpyFu Lead Intelligence

**Phase 5 Implementation**

This Chrome extension monitors ReadyMode call screens and automatically opens Hot Sheets for matched leads.

## Files (To Be Implemented)

- `manifest.json` ✅ Created (template)
- `background.js` - Service worker for API lookups
- `content.js` - ReadyMode DOM monitoring
- `popup.html` - Extension settings UI
- `popup.js` - Settings logic
- `icons/` - Extension icons (16px, 48px, 128px)

## How It Works

1. **Content Script** monitors ReadyMode DOM for phone numbers
2. When call detected, sends phone number to **Background Service Worker**
3. Background worker calls lookup API: `/api/hotsheet/lookup?phone={phone}`
4. If lead found, opens Hot Sheet in new browser window
5. Sales rep sees Hot Sheet alongside ReadyMode during call

## Installation (After Implementation)

```bash
# Load unpacked extension in Chrome
1. Open chrome://extensions/
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select chrome-extension/ directory
```

## Status

⏳ **Not yet implemented** - Phase 5 development pending
