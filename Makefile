.PHONY: dev

dev: skipper_venv
	. skipper_venv/bin/activate \
	&& skipper run -i bun run dev

skipper_venv:
	virtualenv skipper_venv
	. skipper_venv/bin/activate \
	&& python3 -m pip install strato-skipper

