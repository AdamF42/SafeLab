FROM ubuntu:20.04

ARG RELEASE

RUN apt-get update && \
    apt-get install -y wget && \
    apt-get install -y tar && \
    apt-get install -y expect;
    
RUN wget https://dl.influxdata.com/influxdb/releases/$RELEASE.tar.gz
RUN tar xvfz $RELEASE.tar.gz

RUN chmod -R +x /$RELEASE/

RUN cp ./$RELEASE/influx /usr/local/bin/
RUN cp ./$RELEASE/influxd /usr/local/bin/

RUN rm -R $RELEASE.tar.gz $RELEASE

CMD /usr/local/bin/influxd
