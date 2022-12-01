#!/bin/sh
# Copyright Julien Noel
# Rename a component in weblate :
#	- This script check the all requirements before operating the change (files exists / component exist / etc...)
#	- Rename the Files in the git repo (locally)
#	- Update the configuration
#
# Renaming workflow :
# 	1. Devteam :
#		- rename the component in the dev translation folder and keep developping
#		- commit the change
#		- /!\ At no point the devteam rename/add/delete the other translation file
#	2. Opsteam : 
#		- Run this script on the weblate server providing the previous component **SLUG** and the new component **NAME**
#		- Add new translation (at least 1)
#		- Push to github

#set -xe

################################################################################
# Config
################################################################################
# Weblate user Settings / API Access

api_token="Token wlu_putPEjSjLSqjpsNu2Yy6rkQj6dF4J0SVTzdo"
hostname="localization.cidgravity.com"
port="443"

project_name="cidgravity"
main_component_name="common"
data_folder="/opt/weblate/data"
default_language="en-US"

# JSON template, all field can be found here : https://docs.weblate.org/en/latest/api.html
template='{
    "name": "COMPONENT_NAME",
    "slug": "COMPONENT_NAME",
    "filemask": "PROJECT_NAME/locales/*/COMPONENT_NAME.json",
    "template": "PROJECT_NAME/locales/en-US/COMPONENT_NAME.json",
    "file_format": "i18next",
    "intermediate": "PROJECT_NAME/locales/dev/COMPONENT_NAME.json"
  }'


################################################################################
# MAIN
################################################################################

# Variables initialisation
old_name="$1"
new_name="$2"
url="https://$hostname/api/components"
locales_path="$data_folder/vcs/$project_name/$main_component_name/$project_name/locales"

# Move to locales folder
cd "$locales_path"


##########
# Verifications before execution
##########

# enough parameters
if [ -z "$new_name" -o -n "$3" ]
then
    echo Usage : $0 OLD_COMPONENT_SLUG NEW_COMPONENT_NAME
    exit 1
fi

# retrieve current component list
components=$(curl -s -H "Authorization: $api_token" "$url/" --resolve "$hostname:$port:127.0.0.1" | jq -r .results[].name)

# Verify default language exist
if [ -z "$(echo "$components" | grep "^$old_name$")" ]
then
	echo "ERROR: Component $old_name not found"
	exit 1
elif [ -n "$(echo -n "$components" | grep "^$new_name$")" ]
then
	echo "ERROR: a component named $new_name already exists"
	exit 1
elif [ -z "$(git ls-files "$locales_path/$default_language/$old_name.json")" ]
then
	echo "ERROR: cannot find current template $locales_path/$default_language/$old_name.json"
	exit 1
elif [ -n "$(git ls-files "$locales_path/dev/$old_name.json")" ]
then
	echo "ERROR: intermediary still have the old name, ask devteam to rename it with 'git mv $locales_path/dev/$old_name.json $locales_path/dev/$new_name.json'"
	exit 1
elif [ -z "$(git ls-files "$locales_path/dev/$new_name.json")" ]
then
	echo "ERROR: new intermediary not found, ask devteam to produce it $locales_path/dev/$new_name.json"
	exit 1
fi


##########
# Main execution
##########

# RENAME FILES
for i in "$locales_path"/*/"$old_name.json"
do
	NEW=$(dirname $i)"/$new_name.json"
	git mv "$i" "$NEW"
done

# RENAME PREVIOUS COMPONENT
echo "$template" | sed "s/COMPONENT_NAME/$new_name/g ; s/PROJECT_NAME/$project_name/g" | curl -H "Authorization: $api_token" "$url"/$project_name/$old_name/ -X PATCH --data-binary @- -H "Content-Type: application/json" --resolve "$hostname:$port:127.0.0.1"
echo 
