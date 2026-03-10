{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  packages = with pkgs; [
    bun
    nodejs
    cargo
    rustc
    rustup
    pkg-config
    openssl
    glib
    gtk3
    cairo
    gdk-pixbuf
    pango
    webkitgtk_4_1
    librsvg
    nsis
    pkgsCross.mingwW64.stdenv.cc
  ];

  shellHook = ''
    # Prefer rustup-managed toolchains (installs to $HOME/.cargo/bin).
    export PATH="$HOME/.cargo/bin:$PATH"

    export WEBKIT_DISABLE_COMPOSITING_MODE=1
    export LD_LIBRARY_PATH=${
      pkgs.lib.makeLibraryPath [
        pkgs.openssl
        pkgs.glib
        pkgs.gtk3
        pkgs.cairo
        pkgs.gdk-pixbuf
        pkgs.pango
        pkgs.webkitgtk_4_1
        pkgs.librsvg
      ]
    }:$LD_LIBRARY_PATH

    # Cross-compile defaults for `--target x86_64-pc-windows-gnu`.
    export CARGO_TARGET_X86_64_PC_WINDOWS_GNU_LINKER=x86_64-w64-mingw32-gcc
    export CC_x86_64_pc_windows_gnu=x86_64-w64-mingw32-gcc
    export AR_x86_64_pc_windows_gnu=x86_64-w64-mingw32-ar
  '';
}
