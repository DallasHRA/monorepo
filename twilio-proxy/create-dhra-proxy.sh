# create service
twilio api:proxy:v1:services:create \
    --unique-name dhra_field_help_service

# add phone numbers to service
# last number is the publicly facing number
twilio api:proxy:v1:services:phone-numbers:create \
    --service-sid KS5235eba90241399a186dfa32091ef10a \
    --sid PN689d77d4e700c1c7c16dc21875b6c556 && \
twilio api:proxy:v1:services:phone-numbers:create \
    --service-sid KS5235eba90241399a186dfa32091ef10a \
    --sid PN526f74ad03bbaf44c2c4a9f91aa784d2 && \
twilio api:proxy:v1:services:phone-numbers:create \
    --service-sid KS5235eba90241399a186dfa32091ef10a \
    --sid PNff87b1532dacc608437e2937a68ac3cc \
    --is-reserved

twilio api:proxy:v1:services:phone-numbers:list \
    --service-sid KS5235eba90241399a186dfa32091ef10a

# add out of session behavior
twilio api:proxy:v1:services:update \
    --sid KS5235eba90241399a186dfa32091ef10a \
    --out-of-session-callback-url https://63fc93a69e92.ngrok.io/out-of-session \
    --callback-url http://localhost:3000/proxy-callback \
    --intercept-callback-url https://63fc93a69e92.ngrok.io/proxy-intercept



twilio api:serverless:v1:services:environments:create \
    --service-sid ZS66ed7f5b95d0c412f7a932aadb15c952 \
    --domain-suffix prod \
    --unique-name production
