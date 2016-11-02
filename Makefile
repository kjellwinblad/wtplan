# wtplan
# See LICENSE file for copyright and license details.

include config.mk


export GOPATH=$(shell pwd)
export VERSIONSTR=${VERSION}

all: wtplan wtplan-web

wtplan: src/wtplan/main.go
	${GO} generate wtplan
	${GO} build wtplan

wtplan-web: $(wildcard src/wtplan-web/*.go src/wtplan-web/*.js)
	${GO} generate wtplan-web
	${GO} build wtplan-web

clean:
	@echo cleaning
	@rm -f wtplan
	@rm -f wtplan-web

dist: clean
	@echo creating dist tarball
	@mkdir -p wtplan-${VERSION}
	@cp -R src LICENSE Makefile config.mk README.md wtplan.1 wtplan-${VERSION}
	@tar -cf wtplan-${VERSION}.tar wtplan-${VERSION}
	@gzip wtplan-${VERSION}.tar
	@rm -rf wtplan-${VERSION}

install: all
	@echo installing executable files wtplan and wtplan-web to ${DESTDIR}${PREFIX}/bin
	@mkdir -p ${DESTDIR}${PREFIX}/bin
	@cp -f wtplan ${DESTDIR}${PREFIX}/bin
	@chmod 755 ${DESTDIR}${PREFIX}/bin/wtplan
	@cp -f wtplan-web ${DESTDIR}${PREFIX}/bin
	@chmod 755 ${DESTDIR}${PREFIX}/bin/wtplan-web
	@echo installing manual page to ${DESTDIR}${MANPREFIX}/man1
	@mkdir -p ${DESTDIR}${MANPREFIX}/man1
	@sed "s/VERSION/${VERSION}/g" < wtplan.1 > ${DESTDIR}${MANPREFIX}/man1/wtplan.1
	@chmod 644 ${DESTDIR}${MANPREFIX}/man1/wtplan.1

uninstall:
	@echo removing executable files from ${DESTDIR}${PREFIX}/bin
	@rm -f ${DESTDIR}${PREFIX}/bin/wtplan
	@rm -f ${DESTDIR}${PREFIX}/bin/wtplan-web
	@echo removing manual page from ${DESTDIR}${MANPREFIX}/man1
	@rm -f ${DESTDIR}${MANPREFIX}/man1/wtplan.1

.PHONY: all clean dist install uninstall
