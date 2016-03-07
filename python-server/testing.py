from flask import Flask
app = Flask(__name__)

def getSleep(age):
	if age < 50:
		return 7
	else:
		return 13

@app.route("/")
def hello():
	return "Hello World!"

@app.route("/api/<int:age>")
def showi(age):
	return 'The average '+str(age)+' year-old sleeps '+str(getSleep(age)) + \
		   ' hours every night.'

if __name__ == "__main__":
	app.run(debug=True)