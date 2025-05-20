call yarn cache clean
del /q ADMIN\package-lock.json
del /q CLIENT\package-lock.json
del /q SERVER\package-lock.json
del /q ADMIN\yarn.lock
del /q CLIENT\yarn.lock
del /q SERVER\yarn.lock
rmdir /s /q ADMIN\dist
rmdir /s /q CLIENT\dist
rmdir /s /q SERVER\dist
rmdir /s /q ADMIN\node_modules
rmdir /s /q CLIENT\node_modules
rmdir /s /q SERVER\node_modules
pause
