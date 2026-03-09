
# Project Setup

Follow these steps to run the backend locally.

## 1. Navigate to the backend folder

```
cd backend
```

## 2. Create a virtual environment

```
python -m venv venv
```

## 3. Activate the virtual environment

```
source venv/bin/activate
```

## 4. Install dependencies

```
pip install django
```

---

# Project Structure

```
backend/
│
├── booking_system/      # Django project (settings, URLs, configuration)
├── core/                # Django app (views, models, business logic)
├── manage.py
└── venv/                # Virtual environment
```

---

# Run the Development Server

Start the Django development server:

```
python manage.py runserver
```

You should see:

```
Starting development server at http://127.0.0.1:8000/
```

---

# Access the Application

Open the following URL in your browser:

```
http://127.0.0.1:8000/
```

If everything is set up correctly, Django’s default welcome page will appear.


