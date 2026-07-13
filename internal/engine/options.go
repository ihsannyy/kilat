package engine

type Options struct {
	MemoryLimit int64 // dalam bytes, 0 = tidak terbatas
	Timeout     int   // dalam detik, 0 = tidak ada timeout
}

func DefaultOptions() Options {
	return Options{
		MemoryLimit: 0,
		Timeout:     0,
	}
}
