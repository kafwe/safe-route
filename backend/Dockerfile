# Use the osmnx base image
FROM gboeing/osmnx

# Use root user to create the app directory
USER root
RUN mkdir /app

# Switch back to the original user
USER ox

# Set the working directory
WORKDIR /app

# Install pip in the conda environment and then install Flask and Flask-CORS
RUN conda install -c conda-forge pip && \
    conda run -n ox pip install flask flask-cors

# Copy the app.py file into the container
COPY app.py .

# Expose the port the app runs on
EXPOSE 8080

# Ensure the environment is activated when the container starts
ENTRYPOINT ["conda", "run", "--no-capture-output", "-n", "ox", "python", "app.py"]
