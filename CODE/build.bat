echo on
cd SERVER
call build.bat
cd ..\CLIENT
call build.bat
cd ..\ADMIN
call build.bat
cd ..
pause
