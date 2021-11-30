
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
import re
import docker

def compiler_wrapper(compiler_input, language):
	line_numbers = []
	if language == "C":
		# Chunao: I've changed echo to printf cuz printf will parse \n literally without actual line break, causing compilation to fail
		compiler_input = compiler_input.replace("%", "%%")
		compiler_input = compiler_input.replace("\\n\"", "\\\\n\"")
		print(compiler_input)
		dockerCommand = ["/bin/sh", "-c", ("printf '" + compiler_input + "' > compile.c && gcc compile.c && ./a.out")]
		client = docker.from_env()
		error_r = False
		out_text = ""
		try:
			container = client.containers.run("frolvlad/alpine-gcc", command=dockerCommand)
		except docker.errors.ContainerError as e:
			error_r = True
			out_text = str(e.stderr.decode())
		if not error_r:
			out_text = str(container.decode())
		print ("\n" + out_text + "\n")
		out_text = out_text.replace("./compile_c.sh: 2: ./a.out: not found\n", "")
		matches = re.findall("compile\.c:[0-9]+:[0-9]+:", out_text)
		for match in matches:
			temp_m = match.replace("compile.c:", "")
			temp_m = temp_m.split(':')
			if int(temp_m[0]) not in line_numbers:
				line_numbers += [int(temp_m[0])]
		return out_text, line_numbers
	# elif language == "java":
	# 	dockerCommand = ["/bin/sh", "-c", ("printf '" + compiler_input + "' > compile.java && javac compile.java && java compile")]
	# 	client = docker.from_env()
	# 	error_r = False
	# 	out_text = ""
	# 	try:
	# 		container = client.containers.run("frolvlad/alpine-gcc", command=dockerCommand)
	# 	except docker.errors.ContainerError as e:
	# 		error_r = True
	# 		out_text = str(e.stderr.decode())
	# 	if not error_r:
	# 		out_text = str(container.decode())
	# 	print ("\n" + out_text + "\n")
	else:
		"Language Not Supported"
	return None, None

if __name__ == "__main__":
	# Testing function for pipeline
	print(compiler_wrapper('#incluede<stdio.h>\n\nint main(int argc, char *argv[]) {\nprintf ("Hello World") ;\nreturn 0;\n\n}', "C"))
