call yarn run build
robocopy dist ..\SERVER\dist\public\admin /MIR /FFT /W:0 /R:1 /NDL /NJH /NJS
