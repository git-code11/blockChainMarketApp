import sys
import json
import secrets


def run(oFile, *fileNames):
	dataOut = {}
	try:
		for fileName in fileNames:
			with open(fileName) as iFile:
				dataIn = json.load(iFile)
				dataOut.update(dataIn)
	except Exception as e:
		print("Error Occured:", e)
	finally:
		json.dump(dataOut, oFile, indent=4)

def main():
	inputFileNames = sys.argv[1:]
	outputFileName = secrets.token_hex(8) + '.json'

	outputFile = open(outputFileName, 'w')

	print("Merging...")
	
	run(outputFile, *inputFileNames)
	
	print(f"Task Completed: {outputFileName}")


if __name__ == "__main__":
	if( (len(sys.argv) > 1 and sys.argv[1] == "-h") or len(sys.argv) < 3 ):
		print("Usage: merge.py filename1 filename2 filename3 ...")
		print("Description: for merging multiple json files into one file")
	else:
		main()


