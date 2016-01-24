import pdfminerms.tools.pdf2txt
from subprocess import Popen, PIPE

def get_content(file_root='pdfminerms/samples/simple1.pdf'):
	parse_pipe = Popen(['pdfminerms/tools/pdf2txt.py', file_root], stdout=PIPE)
	return parse_pipe.communicate()[0]

if __name__ == '__main__':
	get_content()
