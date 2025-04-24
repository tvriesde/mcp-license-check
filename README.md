# MCP License Check

## How to Use with Claude Desktop

1. Ensure [Node.js](https://nodejs.org/) is installed locally.

2. Configure your `mcpServers` in your settings:

    ```json
    {
      "mcpServers": {
        "vehicle-information": {
          "command": "node",
          "args": [
            "C:/ABSOLUTE/PATH/TO/BUILD/DIRECTORY/index.js"
          ]
        }
      }
    }
    ```

- Replace `C:/ABSOLUTE/PATH/TO/BUILD/DIRECTORY/index.js` with the actual path to your build directory.