import os
import os.path
from flask import Flask, render_template, request, redirect, url_for, send_from_directory
from werkzeug import secure_filename
from parse import get_content

  
app = Flask(__name__)

UPLOAD_FOLDER = './static/pdf'
ALLOWED_EXTENSIONS = set(['pdf'])


app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
  
@app.route('/')
def home():
  return render_template('home.html')

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET', 'POST'])
def upload_file():
  target_file = ''
  original_text = ''
  if request.method == 'POST':
      file = request.files['file']
      if file and allowed_file(file.filename):
          filename = secure_filename(file.filename)
          target_file = os.path.join(app.config['UPLOAD_FOLDER'], filename)
          # if os.path.isfile(target_file):
          #   os.remove(target_file)
          file.save(target_file)
          original_text = get_content(target_file).decode('utf8')
          # return redirect(url_for('uploaded_file',
          #                         filename=filename))
          return render_template('pdf.html', target_file = target_file, terms = original_text)
          # return render_template('test.html', original_text=original_text)

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               filename)
  
@app.route('/about')
def about():
  return render_template('about.html')
  
if __name__ == '__main__':
  app.run(debug=True)