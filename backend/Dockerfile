FROM continuumio/miniconda3

# Copy the environment.yml file into the container
COPY environment.yml .

# Create the conda environment using the environment.yml file
RUN conda env create -f environment.yml

# Activate the conda environment
SHELL ["conda", "run", "-n", "ox", "/bin/bash", "-c"]

# Create a directory for the app
RUN mkdir /app

# Copy only the app.py file
COPY app.py /app/

# Set the working directory
WORKDIR /app

# Set the command to run your Flask application
CMD ["python", "app.py"]