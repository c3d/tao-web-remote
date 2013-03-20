# ******************************************************************************
#  web_remote.pro                                                   Tao project
# ******************************************************************************
# File Description:
# Qt build file for the Web Remote module
# ******************************************************************************
# This software is property of Taodyne SAS - Confidential
# Ce logiciel est la propriété de Taodyne SAS - Confidentiel
# (C) 2013 Jerome Forissier <jerome@taodyne.com>
# (C) 2013 Taodyne SAS
# ******************************************************************************

!build_pass:!system(bash -c \"npm -v\" >/dev/null) {
  error(npm not found. Did you install NodeJS? \
        [\'sudo apt-get install nodejs\' or \'sudo port install nodejs\' \
        or from http://nodejs.org/])
}

MODINSTDIR = web_remote

include(../modules.pri)

OTHER_FILES = web_remote.xl
OTHER_FILES += doc/web_remote.doxy.h doc/Doxyfile.in

# Icon from: http://www.iconspedia.com/icon/iphone-12112.html
# Author: Archigraphs, http://www.archigraphs.com/
# License: Free
INSTALLS    += thismod_icon
INSTALLS    -= thismod_bin


QMAKE_SUBSTITUTES = doc/Doxyfile.in
QMAKE_DISTCLEAN = doc/Doxyfile
DOXYFILE = doc/Doxyfile
DOXYLANG = en,fr
include(../modules_doc.pri)

# node_modules: the NodeJS modules directory
# Created by 'npm install' which REQUIRES AN INTERNET CONNECTION
PRE_TARGETDEPS = node_modules/.inst
node_modules.target = node_modules/.inst
node_modules.commands = npm install express@3.1.0 socket.io@0.9.13 && touch node_modules/.inst
QMAKE_EXTRA_TARGETS += node_modules
distclean_rm_node_modules.commands = rm -rf ./node_modules/* ./node_modules/.inst
distclean.depends = distclean_rm_node_modules
QMAKE_EXTRA_TARGETS += distclean distclean_rm_node_modules

# Install NodeJS modules
install_node_modules.files = ./node_modules
install_node_modules.path  = $${MODINSTPATH}
QMAKE_EXTRA_TARGETS += install_node_modules
INSTALLS += install_node_modules

install_extra.files = web_remote.js web_remote.html
install_extra.path = $${MODINSTPATH}
QMAKE_EXTRA_TARGETS += install_extra
INSTALLS += install_extra

