let
  pkgs = import <nixpkgs> {};

  unstable = import (builtins.fetchTarball {
    url = "https://github.com/NixOS/nixpkgs/archive/nixos-unstable.tar.gz";
    sha256 = "sha256-gf2AmWVTs8lEq7z/3ZAsgnZDhWIckkb+ZnAo5RzSxJg=";
  }) {};
in
  pkgs.mkShell {
    buildInputs = [
      pkgs.bun
      pkgs.gcc
      unstable.prisma-engines_7
    ];

    PRISMA_SCHEMA_ENGINE_BINARY = "${unstable.prisma-engines_7}/bin/schema-engine";
    PRISMA_QUERY_ENGINE_BINARY = "${unstable.prisma-engines_7}/bin/query-engine";

    shellHook = ''
      export LD_LIBRARY_PATH=${pkgs.stdenv.cc.cc.lib}/lib:$LD_LIBRARY_PATH
    '';
  }
