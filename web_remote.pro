# ******************************************************************************
# web_remote.pro                                                   Tao3D project
# ******************************************************************************
#
# File description:
# Qt build file for the Web Remote module
#
#
#
#
#
#
#
# ******************************************************************************
# This software is licensed under the GNU General Public License v3
# (C) 2013, Baptiste Soulisse <baptiste.soulisse@taodyne.com>
# (C) 2013, Catherine Burvelle <catherine@taodyne.com>
# (C) 2013-2014,2019, Christophe de Dinechin <christophe@dinechin.org>
# (C) 2013-2014, Jérôme Forissier <jerome@taodyne.com>
# ******************************************************************************
# This file is part of Tao3D
#
# Tao3D is free software: you can r redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Tao3D is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with Tao3D, in a file named COPYING.
# If not, see <https://www.gnu.org/licenses/>.
# ******************************************************************************

!build_pass:!system(bash -c \"npm -v >/dev/null\") {
  error(npm not found. Did you install NodeJS? \
        [\'sudo apt-get install nodejs\' or \'sudo port install nodejs\' \
        or from http://nodejs.org/])
}

MODINSTDIR = web_remote

include(../modules.pri)

OTHER_FILES = web_remote.xl
OTHER_FILES += web_remote.js static/web_remote.html doc/web_remote.doxy.h doc/Doxyfile.in

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
node_modules.commands = npm install express@3.1.0 socket.io@0.9.13 socket.io-client@0.9.11 || npm install express@3.1.0 socket.io@0.9.13 socket.io-client@0.9.11 || npm install express@3.1.0 socket.io@0.9.13 socket.io-client@0.9.11 && touch node_modules/.inst
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


install_static.files = ./static
install_static.path = $${MODINSTPATH}
QMAKE_EXTRA_TARGETS += install_static
INSTALLS += install_static
