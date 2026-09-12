# Contributing to Kilat

Makasih udah mau contribute! Berikut cara mulai.

## Setup Development

```bash
git clone https://github.com/ihsannyy/kilat
cd kilat
go mod tidy
go build -o kilat ./cmd/kilat
```

## Struktur Code

```
cmd/kilat/main.go        → CLI entry point
internal/engine/         → Goja runtime engine
internal/modules/        → Built-in modules (fs, os, bun, dll)
internal/pkgmanager/     → Package manager logic
internal/createcmd/      → Template scaffolding
internal/initcmd/        → kilat init
internal/repl/           → REPL
internal/utils/          → Helper functions
```

## Nambahin Fitur Baru

1. Bikin branch dari `main`
2. Tulis code-nya
3. Jalankan `go build -o kilat ./cmd/kilat` buat test lokal
4. Pastiin `go test ./...` jalan tanpa error
5. Kirim PR ke `main`

## Nambahin Module Baru

1. Buat file baru di `internal/modules/`
2. Register module-nya di `internal/engine/runtime.go`
3. Tambahin test di folder yang sama
4. Update README.md

## Code Style

- Pakai `gofmt` buat format code
- Komentar yang jelas kalau logikanya rumit
- Test buat fitur baru

## Bug Report

Kalau nemu bug, bikin issue dengan:
- Steps buat reproduce
- Expected behavior
- Actual behavior
- Versi Kilat (`kilat --version`)

## Pull Request

- Jelasin apa yang diubah dan kenapa
- Test dulu sebelum submit
- Satu PR buat satu fitur/fix

---

Makasih! 🙏
