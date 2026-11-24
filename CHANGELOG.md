# Changelog

## [0.2.3] - 2026-11-23

### Added

- Added a gRPC server facade for `HyperServer` through `server.grpc.handle(...)`.

### Changed

- gRPC server responses now send `grpc-status` and other HTTP/2 trailers.
