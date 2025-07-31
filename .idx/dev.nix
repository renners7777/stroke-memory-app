{ pkgs, ... }: {
  # Define the Nix channel to use for packages. stable-24.05 is a good starting point.
  channel = "stable-24.05";

  # Specify the packages needed for React Native development.
  packages = [
    pkgs.nodejs_20 # Node.js for running React Native
    # You might need other packages later depending on your specific needs,
    # like watchman for file watching or specific Android/iOS build tools
    pkgs.android-tools
    pkgs.nano
     # Add specific Android SDK components managed by Nix
    pkgs.androidsdk.platforms.android-33 # Example: Android 13 Platform (API 33)
    pkgs.androidsdk.build-tools.latest # Example: Latest build tools
    pkgs.androidsdk.emulator # Example: Android emulator
  ];

  # Configure Firebase Studio specific settings
  idx = {
    # Add recommended VS Code extensions for React Native and potentially Firebase
    extensions = [
      "dbaeumer.vscode-eslint" # For linting your JavaScript/TypeScript code
      "esbenp.prettier-vscode" # For code formatting
      # You might also want extensions for React Native and Firebase development
    ];

    # Define workspace lifecycle hooks
    workspace = {
      # Commands to run when the workspace is first created
      onCreate = {
        # Install npm dependencies for your React Native project
        "npm-install" = "npm install";
        # You might also want to install global React Native CLI here if needed
      };

      # Commands to run every time the workspace is started
      onStart = {
        # You might want to start your React Native development server here
        # For example: "npm start" or "react-native start"
        # Or if you have a backend server running locally, you can start it here
      };
    };

    # Configure web previews if your app has a web component or you want to preview a web version
    # previews = {
    #   enable = true;
    #   previews = {
    #     web = {
    #       command = ["npm" "run" "web" "--" "--port" "$PORT"]; # Example command to start a web preview
    #       manager = "web";
    #     };
    #   };
    # };
  };


}
