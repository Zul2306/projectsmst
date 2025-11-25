import uvicorn

if __name__ == "__main__":
    print("Swagger Docs → http://127.0.0.1:8000/docs")
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)