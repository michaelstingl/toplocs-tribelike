# Tribelike Client Deployment with Plugins

This GitHub Action workflow builds and deploys the Tribelike client application to GitHub Pages, with optional plugin support.

## Features

- 🚀 Automatic deployment on push to main branch
- 🔌 Dynamic plugin inclusion (Event, Wiki, Chat plugins)
- 📦 Plugin registry generation
- 🌐 GitHub Pages deployment
- 🎛️ Manual workflow dispatch with plugin selection

## Usage

### Automatic Deployment

The workflow runs automatically when you push to the `main` branch. By default, it includes the Event Plugin.

### Manual Deployment

You can manually trigger the deployment from the Actions tab with custom plugin selection:

1. Go to Actions → Deploy Client with Plugins to GitHub Pages
2. Click "Run workflow"
3. Select which plugins to include:
   - **Event Plugin** (P2P) - Default: enabled
   - **Wiki Plugin** - Default: disabled  
   - **Chat Plugin** - Default: disabled (not yet implemented)
4. Optionally specify plugin branches

### Configuration

No configuration needed! The workflow uses GitHub context variables:
- `github.repository_owner` - Your GitHub username or organization
- `github.event.repository.name` - Your repository name

### Deployment URLs

After successful deployment, your site will be available at:
- **Standard**: `https://[username].github.io/[repository]/`
- **Custom Domain**: If configured in GitHub Pages settings
- **Plugins**: Available at `/plugins/[plugin-name]/`

### Prerequisites

1. Enable GitHub Pages in your repository settings:
   - Go to Settings → Pages
   - Source: GitHub Actions

2. Ensure your repository has:
   - `pnpm` workspace configuration
   - `server/dist/views/` as the build output directory

### Plugin Development

To add support for new plugins:

1. Add new input parameters in the `workflow_dispatch` section
2. Clone and build the plugin in a new step
3. Update the Plugin Registry generation
4. Copy plugin files to `server/dist/views/plugins/[plugin-name]/`

### Environment Variables

The workflow supports these environment variables for plugin builds:
- `PLUGIN_BASE_PATH` - Base path for plugin assets (e.g., `/plugins/event-plugin/`)

## Contributing

This workflow is designed to be fork-friendly and works with any GitHub account without modification.

## License

Part of the Tribelike project - see main repository for license information.