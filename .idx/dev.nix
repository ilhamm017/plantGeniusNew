# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-23.11"; # or "unstable"

  # Use https://search.nixos.org/packages to find packages
  packages = [
    # pkgs.go
    # python
    pkgs.python311
    pkgs.python311Packages.pip
    pkgs.python311Packages.tensorflow

    pkgs.python311Packages.flake8   # Linter Python
    pkgs.python311Packages.black    # Formatter kode Python 
    pkgs.python311Packages.autopep8 # Formatter Python alternatif

    # nodejs
    pkgs.nodejs_20
    pkgs.nodePackages.nodemon
    pkgs.nodePackages.eslint        # Linter JavaScript
    pkgs.nodePackages.prettier      # Formatter kode JavaScript

  ];

  # Sets environment variables in the workspace
  env = {};
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      # "vscodevim.vim"
      # Python
      "ms-python.python"             # Ekstensi Python resmi dari Microsoft
      "ms-python.vscode-pylance"    # Language Server Protocol (LSP) untuk Python
      "njpwerner.autodocstring"      # Membuat docstring otomatis

      # Node.js
      "dbaeumer.vscode-eslint"       # Integrasi ESLint
      "esbenp.prettier-vscode"       # Integrasi Prettier
    ];

    # Enable previews
    previews = {
      enable = true;
      previews = {
        # web = {
        #   # Example: run "npm run dev" with PORT set to IDX's defined port for previews,
        #   # and show it in IDX's web preview panel
        #   command = ["npm" "run" "dev"];
        #   manager = "web";
        #   env = {
        #     # Environment variables to set for your server
        #     PORT = "$PORT";
        #   };
        # };
      };
    };

    # Workspace lifecycle hooks
    workspace = {
      # Runs when a workspace is first created
      onCreate = {
        # Example: install JS dependencies from NPM
        # npm-install = "npm install";
      };
      # Runs when the workspace is (re)started
      onStart = {
        # Example: start a background task to watch and re-build backend code
        # watch-backend = "npm run watch-backend";
      };
    };
  };
}
