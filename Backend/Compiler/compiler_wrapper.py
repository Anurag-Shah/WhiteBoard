
#############################################################################
# compiler_wrapper.py
#
# Authors: Anurag
#
# Provides a wrapper interface for the compiler process
# This includes programming language detection
#############################################################################

# ocr_wrapper
# Author: Anurag
# Return value: string of data
# Parameters:
#	1. compiler_input - text input
#	2. language - programming language
# This function is a wrapper for the entire Compiler Process

import subprocess
import os

def compiler_wrapper(compiler_input, language):
	line_numbers = []
	if language == "C":
		with open("compile.c", "w") as outfile:
			outfile.write(compiler_input)
		proc = subprocess.run(['sh', './compile_c.sh'], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
		with open("compile.c", "w") as outfile:
			outfile.write("")
		os.remove("compile.c")
		if (os.path.exists("a.out")):
			os.remove("a.out")
		return proc.stdout, line_numbers
	else:
		"Language Not Supported"
	return None, None

if __name__ == "__main__":
	# Testing function for pipeline
	compiler_wrapper(('#include<stdio.h>\n\nint main(int argc, char *argv[]) {\nprintf ("Hello World") ;\nreturn 0;\n\n}', "C"))
