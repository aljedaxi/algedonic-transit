tripupdates.pb:
	# check https://data.calgary.ca/Transportation-Transit/Calgary-Transit-Realtime-Trip-Updates-GTFS-RT/gs4m-mdc2/about_data
	@curl "https://data.calgary.ca/api/views/gs4m-mdc2/files/93ffd6e0-96d5-4ad3-b3f5-191088f20844?filename=tripupdates.pb" > $@

stop:
	@curl -s https://data.calgary.ca/resource/muzh-c9qc.json | jq -rc '.[]' | fzf | jq > $@

run: tripupdates.pb
	@node index.mjs $<
	@rm tripupdates.pb
