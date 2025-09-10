# Portfolio Project

This is a simple portfolio web application with weather functionality.

## Features
- Personal portfolio page
- Weather information via API

## Getting Started

1. **Clone the repository:**
   ```
   git clone https://github.com/nika-chkhaidze/portfolio.git
   cd portfolio
   ```

2. **Install dependencies:**
   - Make sure you have Python installed.
   - (Optional) Create a virtual environment:
     ```
     python -m venv venv
     venv\Scripts\activate
     ```
   - Install required packages:
     ```
     pip install -r requirements.txt
     ```
     *(If you have a requirements.txt file. Otherwise, install Flask:)*
     ```
     pip install Flask
     ```

3. **Run the backend server:**
   ```
   python app.py
   ```
   The server will start at http://127.0.0.1:5000

4. **Open `index.html` in your browser.**

## Notes
- Make sure `favicon.ico` is present in the project root to avoid browser errors.
- The weather feature requires the backend server to be running.

## License
MIT
