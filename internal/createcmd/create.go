package createcmd

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/fatih/color"
)

type Template struct {
	Name        string
	Description string
	Files       map[string]string
}

func getTemplates() map[string]Template {
	return map[string]Template{
		"vanilla": {
			Name:        "vanilla",
			Description: "Plain JavaScript project",
			Files: map[string]string{
				"package.json": `{
  "name": "%NAME%",
  "version": "1.0.0",
  "scripts": {
    "dev": "kilat run src/index.js --watch",
    "start": "kilat run src/index.js"
  }
}`,
				"src/index.js": `console.log("Hello from Kilat!");

const app = {
  version: "1.0.0",
  start() {
    console.log("App started v" + this.version);
  }
};

app.start();`,
			},
		},
		"react": {
			Name:        "react",
			Description: "React + Vite project",
			Files: map[string]string{
				"package.json": `{
  "name": "%NAME%",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0"
  }
}`,
				"vite.config.js": `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`,
				"index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>%NAME%</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>`,
				"src/main.jsx": `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)`,
				"src/App.jsx": `import { useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui' }}>
      <h1>React + Kilat</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </div>
  )
}`,
			},
		},
		"hono": {
			Name:        "hono",
			Description: "Hono web server",
			Files: map[string]string{
				"package.json": `{
  "name": "%NAME%",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "kilat run src/index.js --watch",
    "start": "kilat run src/index.js"
  },
  "dependencies": {
    "hono": "^4.0.0"
  }
}`,
				"src/index.js": `import { Hono } from 'hono'
import { serve } from 'hono/bun'

const app = new Hono()

app.get('/', (c) => {
  return c.json({ message: 'Hello from Hono + Kilat!' })
})

app.get('/api/time', (c) => {
  return c.json({ time: new Date().toISOString() })
})

app.get('/api/user/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ user: id })
})

serve({
  fetch: app.fetch,
  port: 3000,
})

console.log('Hono server running on http://localhost:3000')`,
			},
		},
		"vite": {
			Name:        "vite",
			Description: "Vite + vanilla TypeScript",
			Files: map[string]string{
				"package.json": `{
  "name": "%NAME%",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}`,
				"vite.config.js": `import { defineConfig } from 'vite'

export default defineConfig({
  server: { port: 3000 }
})`,
				"index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>%NAME%</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>`,
				"src/main.js": "import './style.css'\n\ndocument.getElementById('app').innerHTML = `\n  <h1>Vite + Kilat</h1>\n  <p>Edit src/main.js and save to reload.</p>\n`",
				"src/style.css": `body {
  font-family: system-ui;
  padding: 40px;
  background: #0a0a0a;
  color: #e2e8f0;
}`,
			},
		},
		"api": {
			Name:        "api",
			Description: "REST API server with Kilat.serve",
			Files: map[string]string{
				"package.json": `{
  "name": "%NAME%",
  "version": "1.0.0",
  "scripts": {
    "dev": "kilat run src/server.js --watch",
    "start": "kilat run src/server.js"
  }
}`,
				"src/server.js": `var routes = {
  '/': function() {
    return { message: 'API Server', version: '1.0.0' }
  },
  '/api/health': function() {
    return { status: 'ok', uptime: process.uptime() }
  },
  '/api/time': function() {
    return { time: new Date().toISOString() }
  }
};

Kilat.serve({
  port: 3000,
  fetch: function(req) {
    var url = new URL(req.url);
    var handler = routes[url.pathname];

    if (handler) {
      var data = handler();
      var headers = new Headers();
      headers.set('Content-Type', 'application/json');
      return new Response(JSON.stringify(data, null, 2), {
        status: 200,
        headers: headers
      });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

console.log('API server running on http://localhost:3000');`,
			},
		},
	}
}

func RunCreate(args []string) error {
	if len(args) < 1 {
		printAvailableTemplates()
		return nil
	}

	templateName := args[0]
	projectName := templateName
	if len(args) > 1 {
		projectName = args[1]
	}

	templates := getTemplates()
	tmpl, ok := templates[templateName]
	if !ok {
		return fmt.Errorf("template '%s' tidak ditemukan", templateName)
	}

	if _, err := os.Stat(projectName); err == nil {
		return fmt.Errorf("folder '%s' sudah ada", projectName)
	}

	if err := os.MkdirAll(projectName, 0755); err != nil {
		return fmt.Errorf("gagal bikin folder: %w", err)
	}

	cyan := color.New(color.FgCyan, color.Bold)
	green := color.New(color.FgGreen)

	cyan.Printf("Creating %s...\n", tmpl.Description)

	for path, content := range tmpl.Files {
		content = strings.ReplaceAll(content, "%NAME%", projectName)

		fullPath := filepath.Join(projectName, path)
		dir := filepath.Dir(fullPath)

		if err := os.MkdirAll(dir, 0755); err != nil {
			os.RemoveAll(projectName)
			return fmt.Errorf("gagal bikin folder %s: %w", dir, err)
		}

		if err := os.WriteFile(fullPath, []byte(content), 0644); err != nil {
			os.RemoveAll(projectName)
			return fmt.Errorf("gagal tulis file %s: %w", path, err)
		}

		fmt.Printf("  %s %s\n", color.New(color.FgYellow).Sprint("Created:"), path)
	}

	fmt.Println()
	green.Printf("Project '%s' created!\n", projectName)
	fmt.Println()
	fmt.Println("  cd " + projectName)
	fmt.Println("  kilat run src/index.js")
	fmt.Println()

	return nil
}

func printAvailableTemplates() {
	cyan := color.New(color.FgCyan, color.Bold)
	yellow := color.New(color.FgYellow)

	cyan.Println("Available templates:")
	fmt.Println()

	templates := getTemplates()
	for _, tmpl := range templates {
		fmt.Printf("  %s %s\n", yellow.Sprint(tmpl.Name), tmpl.Description)
	}

	fmt.Println()
	fmt.Println("Usage: kilat create <template> [project-name]")
}
