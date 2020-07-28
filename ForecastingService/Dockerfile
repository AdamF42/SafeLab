FROM arm64v8/debian:buster-slim

ARG DEBIAN_FRONTEND=noninteractive

# use the value to set the ENV var default
ARG INFLUX_TOKEN
ARG INFLUX_URL
ARG INFLUX_ORG
ARG INFLUX_BUCKET

ENV INFLUX_TOKEN=$INFLUX_TOKEN
ENV INFLUX_URL=$INFLUX_URL
ENV INFLUX_ORG=$INFLUX_ORG
ENV INFLUX_BUCKET=$INFLUX_BUCKET

RUN apt-get update \
    && apt-get install -y curl python3-dev python3-testresources python3-pip \
        libhdf5-dev libc-ares-dev libeigen3-dev gcc gfortran libgfortran5 \
        libatlas3-base libatlas-base-dev libopenblas-dev libopenblas-base libblas-dev \
        liblapack-dev libatlas-base-dev openmpi-bin libopenmpi-dev 

RUN pip3 install Cython==0.29.21

RUN pip3 install keras_applications==1.0.8 --no-deps \
    keras_preprocessing==1.1.0 --no-deps h5py==2.9.0 \
    pybind11==2.5.0 six==1.15.0 wheel mock==4.0.2 \
    numpy==1.19.1 pandas==1.0.5 influxdb-client==1.9.0 \
    && mkdir /app

COPY ./app.py /app
WORKDIR /app

RUN curl https://raw.githubusercontent.com/PINTO0309/Tensorflow-bin/master/tensorflow-2.2.0-cp37-cp37m-linux_aarch64_download.sh -o ./download.sh \ 
    && chmod +x ./download.sh \
    && ./download.sh 


RUN pip3 install tensorflow-2.2.0-cp37-cp37m-linux_aarch64.whl 
    

ENTRYPOINT ["python3"]
CMD ["app.py"]