package modules

import (
	"database/sql"
	"fmt"

	_ "modernc.org/sqlite"
	"github.com/dop251/goja"
)

type DB struct {
	conn *sql.DB
}

func RegisterSQL(vm *goja.Runtime, queueJob func(func()), incrementTasks func(), decrementTasks func()) {
	sqlModule := vm.NewObject()

	sqlModule.Set("open", func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) < 1 {
			throwTypeError(vm, "sql.open requires a database path")
		}
		dbPath := call.Arguments[0].String()

		conn, err := sql.Open("sqlite", dbPath)
		if err != nil {
			throwTypeErrorf(vm, "failed to open database: %v", err)
		}

		dbObj := vm.NewObject()

		dbObj.Set("query", func(call goja.FunctionCall) goja.Value {
			if len(call.Arguments) < 1 {
				throwTypeError(vm, "db.query requires a SQL string")
			}
			query := call.Arguments[0].String()

			var args []interface{}
			if len(call.Arguments) > 1 {
				params := call.Arguments[1].Export()
				if paramList, ok := params.([]interface{}); ok {
					for _, p := range paramList {
						args = append(args, p)
					}
				}
			}

			incrementTasks()

			resultChan := make(chan goja.Value, 1)
			errChan := make(chan error, 1)

			go func() {
				rows, err := conn.Query(query, args...)
				if err != nil {
					errChan <- err
					return
				}
				defer rows.Close()

				columns, err := rows.Columns()
				if err != nil {
					errChan <- err
					return
				}

				var results []interface{}
				for rows.Next() {
					values := make([]interface{}, len(columns))
					valuePtrs := make([]interface{}, len(columns))
					for i := range values {
						valuePtrs[i] = &values[i]
					}

					if err := rows.Scan(valuePtrs...); err != nil {
						errChan <- err
						return
					}

					row := make(map[string]interface{})
					for i, col := range columns {
						val := values[i]
						switch v := val.(type) {
						case []byte:
							row[col] = string(v)
						case nil:
							row[col] = nil
						default:
							row[col] = v
						}
					}
					results = append(results, row)
				}

				jsonStr, _ := vm.RunString("JSON.stringify(" + formatResult(vm, results) + ")")
				resultChan <- jsonStr
			}()

			select {
			case err := <-errChan:
				defer decrementTasks()
				throwTypeErrorf(vm, "query error: %v", err)
				return goja.Undefined()
			case result := <-resultChan:
				defer decrementTasks()
				return result
			}
		})

		dbObj.Set("execute", func(call goja.FunctionCall) goja.Value {
			if len(call.Arguments) < 1 {
				throwTypeError(vm, "db.execute requires a SQL string")
			}
			query := call.Arguments[0].String()

			var args []interface{}
			if len(call.Arguments) > 1 {
				params := call.Arguments[1].Export()
				if paramList, ok := params.([]interface{}); ok {
					for _, p := range paramList {
						args = append(args, p)
					}
				}
			}

			incrementTasks()

			resultChan := make(chan struct {
				RowsAffected int64
				Error         error
			}, 1)

			go func() {
				result, err := conn.Exec(query, args...)
				if err != nil {
					resultChan <- struct {
						RowsAffected int64
						Error         error
					}{0, err}
					return
				}

				rowsAffected, err := result.RowsAffected()
				resultChan <- struct {
					RowsAffected int64
					Error         error
				}{rowsAffected, err}
			}()

			res := <-resultChan
			defer decrementTasks()

			if res.Error != nil {
				throwTypeErrorf(vm, "execute error: %v", res.Error)
			}

			resultObj := vm.NewObject()
			resultObj.Set("rowsAffected", res.RowsAffected)
			return resultObj
		})

		dbObj.Set("close", func() goja.Value {
			conn.Close()
			return goja.Undefined()
		})

		dbObj.Set("ping", func() goja.Value {
			err := conn.Ping()
			if err != nil {
				return vm.ToValue(err.Error())
			}
			return goja.Null()
		})

		return dbObj
	})

	vm.Set("sql", sqlModule)
}

func formatResult(vm *goja.Runtime, results []interface{}) string {
	if len(results) == 0 {
		return "[]"
	}
	result := "["
	for i, row := range results {
		if i > 0 {
			result += ","
		}
		if mapRow, ok := row.(map[string]interface{}); ok {
			result += "{"
			j := 0
			for k, v := range mapRow {
				if j > 0 {
					result += ","
				}
				switch val := v.(type) {
				case string:
					result += fmt.Sprintf(`"%s":"%s"`, k, val)
				case nil:
					result += fmt.Sprintf(`"%s":null`, k)
				default:
					result += fmt.Sprintf(`"%s":%v`, k, val)
				}
				j++
			}
			result += "}"
		}
	}
	result += "]"
	return result
}
