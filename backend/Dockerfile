FROM psmprd/serverless-backend-shortinfo-base:latest
ARG AWS_ACCESS_KEY_ID AWS_SECRET_KEY

WORKDIR /usr/src/app
COPY ./ .


RUN sls config credentials --provider aws --key ${AWS_ACCESS_KEY_ID} --secret ${AWS_SECRET_KEY} --profile default
RUN sls deploy -v


CMD ["npm","start"]
