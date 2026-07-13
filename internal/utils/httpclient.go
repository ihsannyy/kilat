package utils

import (
	"context"
	"net"
	"net/http"
	"os"
	"time"
)

func NewHTTPClient(timeout time.Duration) *http.Client {
	_, err := os.Stat("/etc/resolv.conf")
	if os.IsNotExist(err) {
		dialer := &net.Dialer{
			Timeout:   30 * time.Second,
			KeepAlive: 30 * time.Second,
			Resolver: &net.Resolver{
				PreferGo: true,
				Dial: func(ctx context.Context, network, address string) (net.Conn, error) {
					d := net.Dialer{Timeout: 5 * time.Second}
					conn, err := d.DialContext(ctx, "udp", "1.1.1.1:53")
					if err != nil {
						return d.DialContext(ctx, "udp", "8.8.8.8:53")
					}
					return conn, nil
				},
			},
		}

		transport := &http.Transport{
			Proxy:                 http.ProxyFromEnvironment,
			DialContext:           dialer.DialContext,
			ForceAttemptHTTP2:     true,
			MaxIdleConns:          100,
			IdleConnTimeout:       90 * time.Second,
			TLSHandshakeTimeout:   10 * time.Second,
			ExpectContinueTimeout: 1 * time.Second,
		}

		return &http.Client{
			Transport: transport,
			Timeout:   timeout,
		}
	}

	return &http.Client{
		Timeout: timeout,
	}
}
