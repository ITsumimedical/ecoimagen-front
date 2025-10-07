const routes = [
	{
		title: "Inicio",
		can: "menu.inicio",
		action: "mdi-home",
		items: [
			{
				title: "Piezas informativas",
				to: "/inicio/piezasInformativas",
				can: "menu.piezasInformativas",
			},
			{
				title: "Manuales y videos",
				to: "/inicio/manualesVideos",
				can: "menu.manualesVideos",
			},
			{
				title: "Soporte Horus Health",
				to: "/inicio/soporteAplicativo",
				can: "menu.soporteAplicativo",
			},
			{
				title: "Gestión de Contenido",
				to: "/inicio/gestionContenido",
				can: "menu.gestionContenido",
			},
		],
	},
	{
		title: "Agendamiento",
		can: "agendamiento.medico",
		action: "mdi-calendar",
		items: [
			{
				title: "Agendar",
				to: "/agendamiento/medico",
				can: "agendamiento.medico.vista",
			},
			{
				title: "Programación",
				to: "/agendamiento/registro",
				can: "agendamiento.medico.programacion",
			},
			{
				title: "Programación Cirugias",
				to: "/agendamiento/cirugia",
				can: "agendamiento.medico.programacion",
			},
			{
				title: "Parametrización",
				to: "/agendamiento/parametrizacion",
				can: "agendamiento.parametrizacion.vista",
			},
		],
	},
	{
		title: "Citas",
		can: "cita.afiliados",
		action: "mdi-calendar-cursor",
		items: [
			{
				title: "Agendar",
				to: "/cita/agendamiento",
				can: "cita.agendamiento.vista",
			},
			{
				title: "Agendar Cirugia",
				to: "/cita/cirugia",
				can: "cita.agendamiento.vista",
			},
			{
				title: "Interoperabilidad Whatsapp",
				to: "/cita/interoperabilidadWhatsapp",
				can: "cita.interoperabilidadWhatsapp.vista",
			},
			{
				title: "Parametrización",
				to: "/cita/parametrizacion",
				can: "cita.parametrizacion.vista",
			},
		],
	},
	{
		title: "Admisiones",
		can: "admisiones.menu",
		action: "mdi-calendar-cursor",
		items: [
			{
				title: "Admisión consultas",
				to: "/admisionCitas/admision",
				can: "admisiones.vista",
			},
			{
				title: "Admisión Laboratorios",
				to: "/admisionCitas/admisionLaboratorios",
				can: "admisiones.vista",
			},
			{
				title: "Admisión Servicios",
				to: "/admisionCitas/admisionServicios",
				can: "admisiones.vista",
			},
			{
				title: "Historico de Cobros",
				to: "/admisionCitas/historicoCobros",
				can: "admisiones.vista",
			},
		],
	},

	{
		action: "mdi-clipboard-check",
		title: "Facturacion",
		can: "referencia.menu",
		items: [
			{
				title: "Pendientes",
				to: "/facturacion/pendientes",
				can: "referencia.crear",
			},
			{
				title: "Emitidas",
				to: "/facturacion/emitidas",
				can: "referencia.crear",
			},
		],
	},
	{
		title: "Gestión de sucesos",
		can: "eventoAdverso.menu",
		action: "mdi-alert-plus-outline",
		items: [
			{
				title: "Reporte",
				to: "/evento/reporteEvento",
				can: "eventoAdverso.reporte",
			},
			{
				title: "Gestión",
				to: "/evento/analisisEvento",
				can: "eventoAdverso.gestion",
			},
			{
				title: "Informe",
				to: "/evento/informeEvento",
				can: "eventoAdverso.informe",
			},
			{
				title: "Seguimiento IAAS",
				to: "/evento/seguimientoIAAS",
				can: "eventoAdverso.seguimientoIAAS",
			},
			{
				title: "Parametrización",
				to: "/evento/parametrizacion",
				can: "eventoAdverso.parametrizacion",
			},
		],
	},

	{
		title: "Aseguramiento",
		can: "asegurador.menu",
		action: "mdi-shield-account",
		items: [
			{
				title: "Verificación",
				to: "/aseguramiento/verificacion",
				can: "asegurador.verificacion",
			},
			// {
			//   title: "Portabilidad",
			//   to: "/aseguramiento/portabilidad",
			//   can: "asegurador.menu.portabilidad",
			// },
			{
				title: "Gestor de afiliados",
				to: "/aseguramiento/gestorAfiliados",
				can: "asegurador.afiliados",
			},
			// {
			// 	title: "Barreras de acceso",
			// 	to: "/aseguramiento/barreraAcceso",
			// 	can: "asegurador.menu.barreraAcceso",
			// },
			{
				title: "Parametrización",
				to: "/aseguramiento/parametrizacionAseguramiento",
				can: "asegurador.parametrizacion",
			},
		],
	},
	{
		title: "Barreras de acceso",
		action: "mdi-shield-lock",
		can: "barreraAcceso.menu",
		items: [
			{
				title: "Ingreso barreras acceso",
				to: "/barrerasAcceso/ingresoBarreraAcceso",
				can: "barreraAcceso.menu.ingresoBarreraAcceso",
			},
			// {
			//     title: "Barreras de acceso",
			//     to: "/barrerasAcceso/barreraAcceso",
			//     can: "barreraAcceso.menu.barreraAcceso",
			// },
			{
				title: "Gestión interna",
				to: "/barrerasAcceso/gestionInterna",
				can: "barreraAcceso.menu.gestionInterna"
			},
			{
				title: "Gestión",
				to: "/barrerasAcceso/gestion",
				can: "barreraAcceso.menu.gestion"
			},
			{
				title: "Parametrización",
				to: "/barrerasAcceso/parametrizacion",
				can: "barreraAcceso.menu.parametrizacion"
			}
		]
	},
	{
		title: "Contratos",
		action: "mdi-notebook-edit",
		can: "contrato.menu",
		items: [
			{
				title: "Contratos",
				to: "/contrato/contratos",
				can: "contrato.contrato.vista",
			},
			{
				title: "Familias",
				to: "/contrato/familia",
				can: "contrato.familias.vista",
			},
			{
				title: "Prestadores",
				to: "/contrato/prestador",
				can: "contrato.prestadores.vista",
			},
			{
				title: "Servicios",
				to: "/contrato/cups",
				can: "contrato.servicios.vista",
			},
		],
	},
	{
		title: "Farmacia",
		can: "farmacia.menu.vista",
		action: "mdi-pill",
		items: [
			{
				title: "Dispensación",
				to: "/farmacia/dispensacion",
				can: "farmacia.dispensacion",
			},
			{
				title: "Inventario",
				to: "/farmacia/inventario",
				can: "farmacia.movimientos",
			},
			{
				title: "Farmacovigilancia",
				to: "/farmacia/Farmacovigilancia",
				can: "farmacia.Farmacovigilancia",
			},
			{
				title: "Parametrizacion",
				to: "/farmacia/parametrizacionProgramas",
				can: "farmacia.programa",
			},
			{
				title: "Autorizacion MIPRES",
				to: "/farmacia/autorizacionMipres",
				can: "farmacia.autorizacionMipres",
			},
			{
				title: "Contratos",
				to: "/farmacia/contratos",
				can: "farmacia.contratos.vista",
			}
		],
	},
	{
		title: "Compras-Farmacia",
		can: "farmacia.menu.vista",
		action: "mdi-cash-multiple",
		items: [
			{
				title: "Reposición inventario",
				to: "/farmacia/reposicionInventario",
				can: "farmacia.solicitudes",
			},
			{
				title: "Solicitudes Bodega",
				to: "/farmacia/solicitudesBodegas",
				can: "farmacia.solicitudes",
			},
			{
				title: "Auditoria Solicitudes",
				to: "/farmacia/auditoriaSolicitudes",
				can: "farmacia.auditorias",
			},
			{
				title: "Movimiento Solicitudes",
				to: "/farmacia/movimientosSolicitudes",
				can: "farmacia.movimientos",
			},
		]
	},
	{
		title: "Informes-Farmacia",
		can: "farmacia.menu.vista",
		action: "mdi-folder-download",
		items: [
			{
				title: "Kardex",
				to: "/farmacia/kardex",
				can: "farmacia.movimientos",
			},
			{
				title: "Dispensado",
				to: "/farmacia/dispensado",
				can: "farmacia.movimientos",
			},
			{
				title: "Existencia",
				to: "/farmacia/existencias",
				can: "farmacia.movimientos",
			},
		]
	},
	{
		title: "Compras",
		can: "compras.menu",
		action: "mdi-cart-heart",
		items: [
			{
				title: "Proveedores",
				to: "/compras/proveedor",
				can: "compras.proveedor",
			},
			{
				title: "Parametrización",
				to: "/compras/parametrizacion",
				can: "compras.parametrizacion",
			},
		],
	},
	{
		title: "Panel Médico",
		can: "panelmedico.atenciones",
		action: "mdi-stethoscope",
		items: [
			{
				title: "Atención médica",
				to: "/panelMedico/atencion",
				can: "panelmedico.atenciones.vista",
			},
			{
				title: "Asistencia educativa",
				to: "/panelMedico/asistenciaEducativa",
				can: "panelmedico.asistenciaeducativa.vista",
			},
			{
				title: "Demanda inducida",
				to: "/panelMedico/demandaInducida",
				can: "demandaInducida.vista",
			},
			{
				title: "Evoluciones",
				to: "/panelMedico/evoluciones",
				can: "panelmedico.evoluciones.vista",
			},
			{
				title: "Epicrisis",
				to: "/panelMedico/epicrisis",
				can: "panelmedico.epicrisis.vista",
			},
			{
				title: "Formato referencia",
				to: "/panelMedico/formatoReferencia",
				can: "panelmedico.formatoReferencia.vista",
			},
			{
				title: "Atenciones No Finalizadas",
				to: "/panelMedico/historiasSinFinalizar",
				can: "panelmedico.atenciones.vista",
			},
			{
				title: "Oncologia",
				to: "/panelMedico/oncologia",
				can: "panelmedico.oncologia",
			},
			{
				title: "Parametrizacion",
				to: "/panelMedico/parametrizacion",
				can: "panelmedico.parametrizacion.vista",
			},
		],
	},
	{
		title: "Enfermeria",
		can: "admisionUrgencias.enter",
		action: "mdi-bottle-tonic-plus-outline",
		items: [
			{
				title: "Asignar Camas",
				to: "/enfermeria/AsignarCama",
				can: "admisionUrgencias.vista",
			},
		],
	},
	{
		title: "Censo",
		can: "admisionUrgencias.enter",
		action: "mdi-bottle-tonic-plus-outline",
		items: [
			{
				title: "Observacion",
				to: "/censo/observacion",
				can: "admisionUrgencias.vista",
			},
		],
	},
	{
		title: "Admisión de urgencias",
		can: "admisionUrgencias.enter",
		action: "mdi-bottle-tonic-plus-outline",
		items: [
			{
				title: "Registro",
				to: "/admisionUrgencias/registro",
				can: "admisionUrgencias.vista",
			},
		],
	},
	{
		title: "Autorización",
		can: "autorizacion.menu",
		action: "mdi-gavel",
		items: [
			{
				title: "Medicamentos",
				to: "/autorizacion/medicamentos",
				can: "autorizacion.medicamentos",
			},
			{
				title: "Servicios",
				to: "/autorizacion/servicios",
				can: "autorizacion.servicios",
			},
			{
				title: "Cirugía",
				to: "/autorizacion/serviciosCirugia",
				can: "autorizacion.servicios",
			},
			{
				title: "Oncología",
				to: "/autorizacion/oncologia",
				can: "autorizacion.oncologia",
			},
			// {
			//   title: "Otros Servicios",
			//   to: "/autorizacion/otrosServicios",
			//   can: "autorizacion.otrosServicios",
			// },
			// {
			//   title: 'Paquetes',
			//   to: '/autorizacion/paquetes',
			//   can: 'autorizacion.paquetes'
			// }
		],
	},
	{
		title: "Transcripciones",
		can: "transcripcion.menu",
		action: "mdi-text-box-multiple-outline",
		items: [
			{
				title: "Externa",
				to: "/transcripcion/transcripcion",
				can: "transcripcion.listar",
			},
			{
				title: "Interna",
				to: "/transcripcion/transcripcionInterna",
				can: "transcripcionInterna.listar",
			},
		],
	},
	{
		title: "Históricos",
		can: "historico.atenciones",
		action: "mdi-archive-clock",
		items: [
			{
				title: "Consultas",
				to: "/historico/consultas",
				can: "historico.atenciones.consultas",
			},
			{
				title: "Consentimientos",
				to: "/historico/consentimientos",
				can: "historico.consentimientos",
			},
			{
				title: "Repositorio Historias",
				to: "/historico/repositorio",
				can: "historico.repositorio.historias",
			},
			{
				title: "Medicamentos Dispensados",
				to: "/historico/historicoDispensacion",
				can: "historico.medicamentosDispensados"
			},
			{
				title: "Ordenes",
				to: "/historico/ordenes",
				can: "historico.atenciones.ordenes",
			},
			{
				title: "Reporte servicios",
				to: "/historico/reportes",
				can: "historico.reporte.servicios",
			},
			{
				title: "Reporte medicamentos",
				to: "/historico/reportesMedicamentos",
				can: "historico.reporte.medicamentos",
			},
			{
				title: "Incapacidades",
				to: "/historico/incapacidades",
				can: "historico.atenciones.incapacidades",
			},
			{
				title: "Laboratorios",
				to: "/historico/laboratorios",
				can: "historico.atenciones.laboratorios",
			},
			{
				title: "Logs Interoperabilidad",
				to: "/historico/seguimiento-interoperabilidad",
				can: "ordenamiento.enviarFomag",
			},
			{
				title: "Órdenes Intrahospitalarias",
				to: '/historico/ordenesIntrahospitalarias',
				can: 'historico.ordenesIntrahospitalarias'
			}
		],
	},
	{
		title: "Prestadores",
		can: "prestadores.atenciones.prestadores",
		action: "mdi-message-plus",
		items: [
			{
				title: "Prestadores",
				to: "/prestadores/prestadores",
				can: "historico.atenciones.prestadores",
			},
			{
				title: "Toma Procedimientos",
				to: "/prestadores/tomaProcedimientos",
				can: "historico.atenciones.procedimientos",
			},
			{
				title: "Dispensación Medicamentos",
				to: "/prestadores/historicoMedicamentos",
				can: "prestadores.historicoDispensacionMedicamentos",
			},
			{
				title: "Indicadores",
				to: "/prestadores/indicadores",
				can: "prestadores.indicadores.lista",
			},
			{
				title: "Parametrizacion",
				to: "/prestadores/parametrizacion",
				can: "prestadores.parametrizacion.lista",
			},
		],
	},
	{
		title: "Caracterización",
		can: "caracterizacion.menu",
		action: "mdi-card-account-details-star-outline ",
		items: [
			{
				title: "Caracterización encuesta",
				to: "/Caracterizacion/caracterizacion_encuesta",
				can: "caracterizacion.registro",
			},
			{
				title: "ECIS",
				to: "/Caracterizacion/caracterizacionEcis",
				can: "caracterizacion.ecis",
			},
			{
				title: "Reporte",
				to: "/Caracterizacion/reporte",
				can: "caracterizacion.reporte",
			},
			{
				title: "Epidemiología",
				to: "/Caracterizacion/epidemiologia",
				can: "caracterizacion.epidemiologia",
			},
			{
				title: "Parametrización epidemiología",
				to: "/Caracterizacion/parametrizacioEpidemiologia",
				can: "caracterizacion.parametrizacionEpidemiologia",
			},
		],
	},
	{
		action: "mdi-shield-alert-outline",
		items: [
			{
				title: "Asistencia Educativa",
				to: "/gestionRiesgo/asistenciaPrincipal",
				can: "asistenciaEducativa.enter",
			},
			{
				title: "Demanda Inducida",
				to: "/demandaInducida/demandaInducida",
				can: "asistenciaEducativa.demandaInducida",
			},
			{
				title: "Admin Demanda Inducida",
				to: "/demandaInducida/administracionDemandaInducida",
				can: "asistenciaEducativa.administracionDemandaInducida",
			},
		],
		title: "Gestión Riesgo",
		can: "asistenciaEducativa.gestionRiesgo",
	},
	{
		action: "mdi-account-network",
		items: [
			{
				title: "Registro",
				to: "/empalme/RegistroEmpalme",
				can: "empalme.listarFerrocarriles",
			},
		],
		title: "Empalme",
		can: "empalme.listarFerrocarriles",
	},
	{
		action: "mdi-account-group",
		items: [
			{
				title: "Ingreso",
				to: "/concurrencia/ingreso",
				can: "concurrencia.ingreso",
			},
			{
				title: "Seguimiento",
				to: "/concurrencia/seguimiento",
				can: "concurrencia.seguimiento",
			},
			{
				title: "Alta",
				to: "/concurrencia/alta",
				can: "concurrencia.alta",
			},
			{
				title: "Línea de tiempo",
				to: "/concurrencia/lineaTiempo",
				can: "concurrencia.lineaTiempo",
			},
		],
		title: "Concurrencia",
		can: "concurrencia.menu",
	},

	{
		action: "mdi-bell-plus",
		items: [
			{
				action: "mdi-post-outline",
				title: "Radicar solicitud",
				to: "/mesaAyuda/radicarSolicitud",
				can: "mesaAyuda.menu",
			},
			{
				action: "mdi-post-outline",
				title: "Mis solicitudes",
				to: "/mesaAyuda/misSolicitudes",
				can: "mesaAyuda.menu",
			},
			// {
			//   action: 'mdi-post-outline',
			//   title: 'Gestión',
			//   to: '/mesaAyuda/gestionMesaAyuda',
			//   can: 'mesaAyuda.gestion'
			// },
			{
				action: "mdi-post-outline",
				title: "Mis asignadas",
				to: "/mesaAyuda/misAsignadas",
				can: "mesaAyuda.asignadas",
			},
			{
				action: "mdi-post-outline",
				title: "Solucionadas",
				to: "/mesaAyuda/solucionadas",
				can: "mesaAyuda.solucionadas",
			},
			{
				action: "mdi-post-outline",
				title: "Central Mesa ayuda",
				to: "/mesaAyuda/central",
				can: "mesaAyuda.central",
			},
			{
				action: "mdi-post-outline",
				title: "Parametrización",
				to: "/mesaAyuda/parametrizacion",
				can: "mesaAyuda.parametrizacion",
			},
		],
		title: "Mesa ayuda",
		can: "mesaAyuda.menu",
	},
	{
		title: "Oncologia",
		can: "oncologia.enter",
		action: "mdi-heart-pulse",
		items: [
			{
				title: "Toma Procedimientos",
				to: "/oncologia/tomaProcedimientos",
				can: "oncologia.tomaProcedimientos",
			},
			{
				action: "mdi-post-outline",
				title: "Resultados Oncologícos",
				to: "/oncologia/solicitudesPrestadores",
				can: "oncologia.soliictudPrestadores",
			},
			{
				title: "Prestadores",
				to: "/oncologia/prestadores",
				can: "oncologia.prestadores",
			},
			{
				title: "Esquemas",
				to: "/oncologia/esquemas",
				can: "oncologia.esquemas",
			},
			{
				title: "Enfermeria",
				to: "/oncologia/enfermeriaOncologia",
				can: "oncologia.enfermeria",
			},
		],
	},
	{
		title: "Ordenamiento",
		can: "ordenamiento.menu",
		action: "mdi-room-service-outline",
		items: [
			{
				title: "Paquetes",
				to: "/ordenamiento/paquetesOrdenamiento",
				can: "ordenamiento.menu",
			},
		],
	},
	{
		action: "mdi-clipboard-check",
		items: [
			{
				title: "Registro",
				to: "/referencia/registro",
				can: "referencia.crear",
			},
			{
				title: "Seguimientos",
				to: "/referencia/seguimientos",
				can: "referencia.seguimiento",
			},
			{
				title: "Procesado",
				to: "/referencia/procesado",
				can: "referencia.procesado",
			},
		],
		title: "Centro Regulador",
		can: "referencia.menu",
	},
	{
		action: 'mdi-text-box-search-outline',
		items: [
			{
				title: "CAC",
				to: "/cac/cac",
				can: "cac.vista",
			},
			{
				title: "Parametrización",
				to: "/cac/parametrizacion",
				can: "cac.parametrizacion",
			}
		],
		title: "CAC",
		can: "cac.vista",
	},
	{
		action: "mdi-folder-arrow-up-down-outline",
		items: [
			{
				action: "mdi-post-outline",
				title: "Validación rips",
				to: "/rips/validadorRips",
				can: "rips.validador",
			},
			{
				action: "mdi-post-outline",
				title: "Radicados",
				to: "/rips/radicados",
				can: "rips.validador",
			},
			{
				action: "mdi-post-outline",
				title: "Generar Rips Odontología",
				to: "/rips/generarRips",
				can: "rips.generar.odontologia",

			},
			{
				action: "mdi-post-outline",
				title: "Logs Rips Sumi",
				to: "/rips/log-registro-rips-sumi",
				can: "rips.generar.logs",

			},
			{
				action: "mdi-post-outline",
				title: "Conversor",
				to: "/rips/conversor",
				can: "rips.validador",
			},
		],
		title: "Rips",
		can: "rips.menu",
	},
	{
		action: "mdi-cloud-arrow-down",
		items: [
			{
				title: "Descarga",
				to: "/fias/descargaFias",
				can: "fias.descarga",
			},
		],
		title: "Fias",
		can: "fias.menu",
	},
	{
		action: "mdi-bank",
		items: [
			{
				title: "Administración",
				to: "/cuentasMedicas/adminCuentasMedicas",
				can: "cuentasMedicas.administracion",
			},
			{
				title: "Asignación factura",
				to: "/cuentasMedicas/asignacionFactura",
				can: "cuentasMedicas.asignacion",
			},
			{
				title: "Auditoria",
				to: "/cuentasMedicas/auditoria",
				can: "cuentasMedicas.auditoria",
			},
			{
				title: "Facturas",
				to: "/cuentasMedicas/facturas",
				can: "cuentasMedicas.auditoria",
			},
			{
				title: "Tesoreria",
				to: "/cuentasMedicas/tesoreria",
				can: "cuentasMedicas.tesoreria",
			},
		],
		title: "Cuentas medicas",
		can: "cuentasMedicas.vista",
	},
	{
		action: "mdi-account-tie",
		items: [
			{
				title: "Asignada",
				to: "/tutela/tutelaAsignada",
				can: "tutelas.asignada",
			},
			{
				title: "Gestión",
				to: "/tutela/gestionAccionesConstitucionales",
				can: "tutelas.gestion",
			},
			{
				title: "Parametrización",
				to: "/tutela/tutelaParametrizacion",
				can: "tutelas.parametrizacion",
			},
		],
		title: "Acción Constitucional",
		can: "tutelas.menu",
	},
	{
		action: "mdi-remote-desktop",
		items: [
			{
				title: "Crear",
				to: "/telesalud/crearTelesalud",
				can: "telesalud.crear",
			},
			{
				title: "Gestión",
				to: "/telesalud/gestion",
				can: "telesalud.gestion",
			},
			{
				title: "Junta Profesionales",
				to: "/telesalud/juntaProfesionales",
				can: "telesalud.juntaProfesionales",
			},
			{
				title: "Reporte",
				to: "/telesalud/reporte",
				can: "telesalud.reporte",
			},
			{
				title: "Parametrización",
				to: "/telesalud/parametrizacion",
				can: "telesalud.parametrizacion",
			},
		],
		title: "Telesalud",
		can: "telesalud.vista",
	},

	{
		action: "mdi-shield-alert-outline",
		items: [
			{
				title: "Asistencia Educativa",
				to: "/gestionRiesgo/asistenciaPrincipal",
				can: "asistenciaEducativa.enter",
			},
			{
				title: "Demanda Inducida",
				to: "/demandaInducida/demandaInducida",
				can: "asistenciaEducativa.demandaInducida",
			},
			{
				title: "Admin Demanda Inducida",
				to: "/demandaInducida/administracionDemandaInducida",
				can: "asistenciaEducativa.administracionDemandaInducida",
			},
		],
		title: "Gestión Riesgo",
		can: "asistenciaEducativa.gestionRiesgo",
	},
    {
        title: "Clientes Mesa Ayuda",
        can: "cuentasMedicas.vista",
		action: "mdi-shield-alert-outline",
		items: [
			{
				title: "Clientes",
				to: "/ClienteMesaAyuda/clientes",
				can: "clientes.mesaAyuda",
			},
		],
	},
	{
		action: "mdi-cloud-arrow-down",
		items: [
			{
				title: "Descarga",
				to: "/fias/descargaFias",
				can: "fias.descarga",
			},
		],
		title: "Fias",
		can: "fias.menu",
	},

	{
		action: "mdi-ambulance",
		items: [
			{
				title: "Ingreso",
				to: "/domiciliaria/ingresoDomiciliario",
				can: "domiciliaria.ingreso",
			},
			{
				title: "Censo Domiciliario",
				to: "/domiciliaria/censoDomiciliario",
				can: "domiciliaria.censo",
			},
		],
		title: "Domiciliaria",
		can: "domiciliaria.menu",
	},
	// {
	//   action: 'mdi-human-male-board',
	//   items: [{
	//     title: 'Solicitud capacitación',
	//     to: '/gestionConocimiento/solicitudCapacitacion',
	//     can: 'solicitudCapacitacion.crear',
	//   }, ],
	//   title: 'Gestión conocimiento',
	//   can: 'gestionConocimiento.menu'
	// },
	{
		action: "mdi-frequently-asked-questions",
		items: [
			{
				title: "Formulario",
				to: "/gestionPqrsf/formulario",
				can: "pqrsf.formulario",
			},
			{
				title: "Gestión",
				to: "/gestionPqrsf/gestion/gestion",
				can: "pqrsf.gestion",
			},
			{
				title: "Gestión Interna",
				to: "/gestionPqrsf/gestionInterna/gestionInterna",
				can: "pqrsf.gestionInterna",
			},
			{
				title: "Gestión Externa",
				to: "/gestionPqrsf/gestionExterna/gestionExterna",
				can: "pqrsf.gestionExterna",
			},
			{
				title: "Central PQRF",
				to: "/gestionPqrsf/centralPqrf/centralPqrf",
				can: "pqrsf.central",
			},
			{
				title: "Parametrización",
				to: "/gestionPqrsf/parametrizacion",
				can: "pqrsf.parametrizacion",
			},
		],

		title: "PQRFs",
		can: "pqrsf.menu",
	},
	{
		action: "mdi-human-male-female",
		items: [
			{
				title: "Empleados",
				to: "/talentoHumano/empleados",
				can: "empleado.menu",
			},
			// {
			//   title: "Cierre de mes",
			//   to: "/talentoHumano/cierreMes",
			//   can: "contratoEmpleado.cierreMes",
			// },
			// {
			//   title: "Inducción específica",
			//   to: "/talentoHumano/induccionEspecifica",
			//   can: "",
			// },
			// {
			//   title: "Incidentes laborales",
			//   to: "/talentoHumano/incidentes",
			//   can: "incidente.listar",
			// },
			{
				title: "Evaluación desempeño",
				to: "/talentoHumano/evaluacionDesempeno",
				can: "evaluacionDesempeno.listar",
			},
			{
				title: "Plan seguimiento individual",
				to: "/talentoHumano/planSeguimiento",
				can: "planSeguimientoIndividual.listar",
			},
			// {
			//   title: "Beneficios laborales",
			//   to: "/talentoHumano/beneficios",
			//   can: "beneficioEmpleado.listar",
			// },
			{
				title: "Parametrización",
				to: "/talentoHumano/parametrizacion",
				can: "talentoHumano.parametrizacion",
			},
		],
		title: "Talento Humano",
		can: "talentoHumano.menu",
	},
	{
		action: "mdi-hand-back-right-outline",
		items: [
			{
				title: "Radicar",
				to: "/solicitudes/radicarSolicitud",
				can: "solicitudes.radicar",
			},
			{
				title: "Gestión",
				to: "/solicitudes/gestion",
				can: "solicitudes.gestion",
			},
			{
				title: "Asignadas",
				to: "/solicitudes/asignadas",
				can: "solicitudes.asignadas",
			},
			{
				title: "Admin",
				to: "/solicitudes/Admin",
				can: "solicitudes.admin",
			},
			{
				title: "Informe",
				to: "/solicitudes/informe",
				can: "solicitudes.informe",
			},
		],
		title: "Solicitudes",
		can: "solicitudes.menu",
	},
	{
		title: "Estadisticas",
		can: "estadistica.listar",
		action: "mdi-chart-line ",
		items: [
			{
				title: "Estadisticas",
				to: "/estadistica/estadistica",
				can: "estadistica.listar",
			},
			{
				title: "Parametrización",
				to: "/estadistica/parametrizacion",
				can: "estadistica.parametrizacion",
			},
		],
	},
	{
		title: "Reportes",
		can: "reportes.vista",
		action: "mdi-file-chart",
		items: [
			// {
			//   title: "Crear tipo de reporte",
			//   to: "/reportes/crearReporte",
			//   can: "reportes.vista",
			// },
			// {
			//   title: "Generar reporte",
			//   to: "/reportes/reporteDinamico",
			//   can: "reportes.vista",
			// },

			{
				title: "Consolidado servicios",
				to: "/reportes/historico-zip",
				can: "reportes.historico.consolidado",
			},
			// {
			// 	title: "Consolidado fórmulas",
			// 	to: "/reportes/consolidado-formulas",
			// 	can: "reportes.historico.consolidado",
			// },
			{
				title: 'Reportes',
				to: '/reportes/reportes',
				can: 'reportes.vista'
			},
			{
				title: "VADEMECUM",
				to: "/farmacia/vademecum",
				can: "vademecum.vista",
			},
			{
				title: "Certificados",
				to: "/reportes/certificados",
				can: "reportes.certificadosMasivos"
			},
			{
				title: "202",
				to: "/reportes/reporte202",
				can: "reporte202.vista",
			},
			{
				title: "Parametrizacion",
				to: "/reportes/parametrizacion",
				can: "crear.reporte",
			}
		],
	},
	// {
	//   action: "mdi-clipboard-plus",
	//   title: "Historia",
	//   can: "historia.vista",
	//   items: [{
	//       title: "Categoria historia",
	//       to: "/historia/categoria",
	//       can: "historia.categorias",
	//     },
	//     {
	//       title: "Tipo campo",
	//       to: "/historia/tipoCampo",
	//       can: "historia.tiposCampos",
	//     },
	//     {
	//       title: "Campos historia",
	//       to: "/historia/campoHistoria",
	//       can: "historia.campos",
	//     },
	//     {
	//       title: "Citas",
	//       to: "/historia/citas",
	//       can: "citas.vistas",
	//     },
	//   ],
	// },
	{
		action: "mdi-calendar-clock",
		items: [
			{
				title: "Turnos",
				to: "/turno/listar",
				can: "turnos.vista",
			},
			{
				title: "Tablero",
				to: "/turno/tablero",
				can: "tablero.vista",
			},
			{
				title: "Llamado",
				to: "/turno/llamado",
				can: "llamado.vista",
			},
			{
				title: "Taquilla",
				to: "/taquilla/taquilla",
				can: "taquilla.vista",
			},
			{
				title: "Areas clinica",
				to: "/areaClinica/areaClinica",
				can: "area.vista",
			},
		],
		title: "Turno",
	},
	{
		action: "mdi-account-check",
		items: [
			{
				title: "Trámites",
				to: "/autogestion/radicarAutogestion",
				can: "autogestion.radicar",
			},
			{
				title: "Certificado de Afiliación",
				to: "/autogestion/certificadoAfiliacion",
				can: "autogestion.certificado",
			},
			{
				title: "PQRFs",
				to: "/autogestion/pqrsfAutogestion",
				can: "autogestion.pqr",
			},
			{
				title: "Citas",
				to: "/autogestion/citasAutogestion",
				can: "autogestion.citas",
			},
			{
				title: "Historia Clinica",
				to: "/autogestion/historias-clinicas-afiliado",
				can: "autogestion.historias.clinicas",
			},
			{
				title: "Ordenes",
				to: "/autogestion/ordenesAutogestion",
				can: "autogestion.ordenes",
			},
		],
		title: "Autogestión",
		can: "autogestion.menu",
	},
	{
		action: "mdi-cash-remove",
		items: [
			{
				title: "Formulario",
				to: "/sarlaft/formularioSarlaft",
				can: "estados.vista",
			},
			{
				title: "Revisión sarlaft",
				to: "/sarlaft/revisionSarlaft",
				can: "estados.vista",
			},
		],

		title: "Sarlaft",
		can: "sarlaft.vista",
	},
	{
		action: "mdi-tools",
		items: [
			{
				title: "Unir PDF's",
				to: "/herramientas/unirPdf",
				can: "blog.vista",
			},
			{
				title: "Eliminar duplicados Excel",
				to: "/herramientas/eliminarDuplicadosExcel",
				can: "blog.vista",
			},

		],

		title: "Herramientas",
		can: "blog.vista",
	},

	{
		action: "mdi-account-key",
		items: [
			{
				title: "Permisos",
				to: "/desarrollo/permiso",
				can: "permisos.vista",
			},
			{
				title: "Estados",
				to: "/desarrollo/estado",
				can: "estados.vista",
			},
			{
				title: "Clientes",
				to: '/desarrollo/cliente',
				can: "clientes.vista",
			},
		],

		title: "Desarrollo",
		can: "modulo.permisos",
	},
	{
		title: "API",
		can: "api.vista",
		action: "mdi-api",
		items: [
			{
				title: "Rutas",
				to: "/api/tipoRutas",
				can: "api.tipoRutas",
			}
		]
	},
	{
		action: "mdi-cog",
		items: [
			{
				title: "Roles",
				to: "/admin/roles",
				can: "roles.vista",
			},
			{
				title: "Cargos",
				to: "/admin/cargos",
				can: "cargos.vista",
			},
			{
				title: "Usuarios",
				to: "/admin/usuarios",
				can: "usuarios.vista",
			},
			{
				title: "Especialidades",
				to: "/admin/especialidades",
				can: "especialidades.vista",
			},
			{
				title: "Entidades",
				to: "/admin/entidades",
				can: "entidades.vista",
			},
			{
				title: "Citas",
				to: "/admin/citas",
				can: "citas.vista",
			},
			{
				title: "Sedes",
				to: "/admin/sedes",
				can: "sedes.vista",
			},
			{
				title: "Colegios",
				to: "/admin/colegios",
				can: "colegio.vista",
			},
			{
				title: "Tipo de test",
				to: "/admin/tipoTest",
				can: "tipoTest.vista",
			},
			{
				title: "Consentimientos informados",
				to: "/admin/consentimientosInformados",
				can: "consentimientosInformados.menu",
			},
			{
				title: "Parametrizacion cups rips",
				to: "/admin/parametrizacionCupRips",
				can: "blog.vista",
			},
			{
				title: "Parametrizacion remision programas",
				to: "/admin/parametrizacionRemisionProgramas",
				can: "blog.vista",
			},
			{
				title: "Recomendaciones",
				to: "/admin/recomendaciones",
				can: "recomendaciones.menu",
			},
			{
				title: "Camas",
				to: "/admin/camas",
				can: "blog.vista",
			},
		],
		title: "Admin",
		can: "admin.enter",
	},
];
const routesDetallados = [
	{
		header: "Inicio",
	},
	{
		component: "Inicio",
		action: "mdi-post-outline",
		title: "Manuales",
		to: "/inicio/manual",
	},

	{
		divider: true,
	},
	{
		header: "Admin",
	},
	{
		component: "Admin",
		title: "Roles",
		to: "/admin/roles",
		can: "rol.vistas",
	},
	{
		component: "Admin",
		title: "Usuarios",
		to: "/admin/usuarios",
		can: "usuarios.vistas",
	},
	{
		component: "Admin",
		title: "Especialidades",
		to: "/admin/especialidades",
		can: "admin.especialidades.vistas",
	},
	{
		divider: true,
	},
	{
		header: "Desarrollo",
	},
	{
		component: "Desarrollo",
		title: "Permisos",
		to: "/desarrollo/permiso",
		can: "permisos.vista",
	},
	{
		component: "Desarrollo",
		title: "Estados",
		to: "/desarrollo/estado",
		can: "estados.vista",
	},
	{
		divider: true,
	},
	{
		header: "Agendamiento",
	},
	{
		component: "Agendamiento",
		title: "Medico",
		to: "/agendamiento/medico",
		can: "agendamiento.vista",
	},
	{
		component: "Agendamiento",
		title: "Parametrizacion",
		to: "/agendamiento/parametrizacion",
		can: "parametrizacion.agenda",
	},
	{
		divider: true,
	},
	{
		header: "Farmacia",
	},
	{
		component: "Farmacia",
		title: "vademecum",
		to: "/medicamento/vademecum",
		can: "vademecum.vista",
	},
	{
		component: "Farmacia",
		title: "Solicitudes Bodega",
		to: "/farmacia/solicitudesBodegas",
		can: "solicitudesBodegas.vista",
	},
	{
		header: "Historia",
	},
	{
		component: "Parametrizacion",
		title: "Categoria historia",
		to: "/historia/categoria",
		can: "agendamiento.medico.vista",
	},
	{
		component: "Parametrizacion",
		title: "Tipo campo",
		to: "/historia/tipoCampo",
		can: "parametrizacion.agenda.enters",
	},
	{
		component: "Parametrizacion",
		title: "Campos historia",
		to: "/historia/campoHistoria",
		can: "parametrizacion.historia",
	},
	{
		divider: true,
	},
];
export default ({ app }, inject) => {
	inject("menu", routes);
	inject("menuDetallado", routesDetallados);
};


