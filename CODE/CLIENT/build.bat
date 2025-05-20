call yarn run build
robocopy dist ..\SERVER\dist\public /MIR /FFT /W:0 /R:1 /NDL /NJH /NJS
