
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
	container = None
	line_numbers = []
	if language == "C":
		# Chunao: I've changed echo to printf cuz printf will parse \n literally without actual line break, causing compilation to fail
		dockerCommand = ["/bin/sh", "-c", ("printf '" + compiler_input + "' > compile.c && gcc compile.c && ./a.out")]
		client = docker.from_env()
		error_r = False
		try:
			container = client.containers.run("frolvlad/alpine-gcc", command=dockerCommand, privileged=True)
		except docker.errors.ContainerError as e:
			error_r = True
			out_text = str(e.stderr.decode())
		if not error_r:
			out_text = str(container.decode())
		out_text = out_text.replace("./compile_c.sh: 2: ./a.out: not found\n", "")
		matches = re.findall("compile\.c:[0-9]+:[0-9]+:", out_text)
		for match in matches:
			temp_m = match.replace("compile.c:", "")
			temp_m = temp_m.split(':')
			if int(temp_m[0]) not in line_numbers:
				line_numbers += [int(temp_m[0])]
		return out_text, line_numbers
	elif language == "C++":
		compiler_input = compiler_input.replace("%", "%%")
		compiler_input = compiler_input.replace("\\n\"", "\\\\n\"")
		dockerCommand = ["/bin/sh", "-c", ("printf '" + compiler_input + "' > compile.cpp && g++ compile.cpp && ./a.out")]
		client = docker.from_env()
		error_r = False
		out_text = ""
		try:
			container = client.containers.run("frolvlad/alpine-gxx", command=dockerCommand, privileged=True)
		except docker.errors.ContainerError as e:
			error_r = True
			out_text = str(e.stderr.decode())
		if not error_r:
			out_text = str(container.decode())
		out_text = out_text.replace("./compile_c.sh: 2: ./a.out: not found\n", "")
		matches = re.findall("compile\.cpp:[0-9]+:[0-9]+:", out_text)
		for match in matches:
			temp_m = match.replace("compile.cpp:", "")
			temp_m = temp_m.split(':')
			if int(temp_m[0]) not in line_numbers:
				line_numbers += [int(temp_m[0])]
		return out_text, line_numbers
	elif language == "C#":
		compiler_input = compiler_input.replace("%", "%%")
		compiler_input = compiler_input.replace("\\n\"", "\\\\n\"")
		dockerCommand = ["/bin/sh", "-c", ("printf '" + compiler_input + "' > compile.cs && mcs compile.cs && mono compile.exe")]
		client = docker.from_env()
		error_r = False
		out_text = ""
		try:
			#container = client.containers.run("frolvlad/alpine-mono", command=dockerCommand, privileged=True)
			container = client.containers.run("mono", command=dockerCommand, privileged=True)
		except docker.errors.ContainerError as e:
			error_r = True
			out_text = str(e.stderr.decode())
		if not error_r:
			out_text = str(container.decode())
			out_text = out_text.replace("Microsoft (R) Visual C# Compiler version 3.6.0-4.20224.5 (ec77c100)\nCopyright (C) Microsoft Corporation. All rights reserved.\n\n", "")
		matches = re.findall("compile\.cs\([0-9]+,[0-9]+\):", out_text)
		for match in matches:
			temp_m = match.replace("compile.cs(", "")
			temp_m = temp_m.split(',')
			if int(temp_m[0]) not in line_numbers:
				line_numbers += [int(temp_m[0])]
		return out_text, line_numbers
	elif language.upper() == "JAVA":
		compiler_input = compiler_input.replace("%", "%%")
		compiler_input = compiler_input.replace("\\n\"", "\\\\n\"")
		temp = compiler_input
		classn = ""
		if len(re.findall("class .* {", temp)) > 1:
			# Multiple classes
			pass
		else:
			# Only 1 class
			classn = re.findall("class .*? {", temp)[0]
			classn = classn.split(" ")[1]
		dockerCommand = ["/bin/sh", "-c", ("printf '" + compiler_input + "' > compile.java && javac compile.java && java " + classn)]
		client = docker.from_env()
		error_r = False
		out_text = ""
		try:
			container = client.containers.run("openjdk:11", command=dockerCommand, privileged=True)
		except docker.errors.ContainerError as e:
			error_r = True
			out_text = str(e.stderr.decode())
		if not error_r:
			out_text = str(container.decode())
		matches = re.findall("compile\.java:[0-9]+:", out_text)
		for match in matches:
			temp_m = match.replace("compile.java:", "")
			temp_m = temp_m.split(':')
			if int(temp_m[0]) not in line_numbers:
				line_numbers += [int(temp_m[0])]
		return out_text, line_numbers
	else:
		"Language Not Supported"
	return None, None

def main():
	# Testing function for pipeline
	print(compiler_wrapper('#include<stdio.h>\n\nint main(int argc, char *argv[]) {\nprintf ("Hello World") ;\nreturn 0;\n\n}', "C"))
	print(compiler_wrapper("#include <iostream>\nint main() {\nstd::cout << \"Hello World\";\nreturn 0;\n}", "C++"))
	print(compiler_wrapper("namespace HelloWorld {\nclass Hello {\n static void Main(string[] args) {\nSystem.Console.WriteLine(\"Hello World\");\n}\n}\n}", "C#"))
	print(compiler_wrapper("class HelloWorld {\npublic static void main(String[] args) {\nSystem.out.println(\"Hello World\");\n}\n}", "Java"))

if __name__ == "__main__":
	main()
