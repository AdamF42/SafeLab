#!/bin/bash

files_list=(
  ./testExistence
  ./createEnv
  ./createAlert

  ./environment/alert/alertGenerator
  ./environment/authorization/authorizationGenerator 
  ./environment/bucket/bucketGenerator 
  ./environment/config/config 
  ./environment/organization/organizationGenerator 
  ./environment/user/userGenerator 
  ./environment/envGenerator
)

for file in ${files_list[@]}
do
  echo Compiling $file
  tsc $file.ts
done