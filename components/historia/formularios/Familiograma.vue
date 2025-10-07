<template>
	<div>
		<v-col cols="12">
			<v-alert class="text-center" text dense border="left" color="info" icon="mdi-human-male-female-child">
				<b>FAMILIOGRAMA</b>
			</v-alert>
		</v-col>
		<v-container fluid v-if="mostrarWorkspace">
			<v-row dense>
				<!-- Toolbox -->
				<v-col cols="2" ref="toolbox" class="toolbox">
					<v-alert text dense border="left" color="blue-grey">
						<v-icon color="blue-grey" left>mdi-toolbox</v-icon><b>Herramientas</b>
					</v-alert>
					<div :class="tool.class" v-for="tool in tools" :key="tool.id" :data-type="tool.class">
						<v-icon>{{ obtenerNombreIcono(tool.class) }}</v-icon>
						<span :class="tool.class">{{ tool.label }}</span>
					</div>
				</v-col>

				<!-- Workspace -->
				<v-col cols="10">
					<v-row align="center" dense>
						<!-- Botones de herramientas -->
						<v-tooltip top>
							<template #activator="{ on, attrs }">
								<v-btn small color="info">
									<v-icon v-bind="attrs" v-on="on" @click="activarDibujo()" color="white">
										mdi-draw-pen
									</v-icon>
								</v-btn>
							</template>
							<span>Dibujar libre</span>
						</v-tooltip>

						<v-tooltip top>
							<template #activator="{ on, attrs }">
								<v-btn small color="error">
									<v-icon v-bind="attrs" v-on="on" @click="dejarDeDibujar()" color="white">
										mdi-pen-off
									</v-icon>
								</v-btn>
							</template>
							<span>Dejar de Dibujar</span>
						</v-tooltip>

						<v-btn @click="guardarFamiliograma()" color="success" small>
							Guardar Familiograma
						</v-btn>

						<v-spacer></v-spacer>

						<v-btn icon color="blue-grey" @click="dialogInformacion = true">
							<v-icon class="bouncing-icon">mdi-information-variant</v-icon>
						</v-btn>

					</v-row>
					<v-col cols="12"></v-col>

					<!-- Panel de dibujo -->
					<div ref="workspace" class="workspace" @mousedown="comenzarDibujo">
						<svg ref="svgLayer" class="svg-layer"></svg>
					</div>
				</v-col>
			</v-row>
		</v-container>


		<div v-if="imagenFamiliograma">
			<img :src="imagenFamiliograma" alt="Familiograma" />
		</div>

		<!-- Diálogo para editar información -->
		<v-dialog v-model="dialogoVisible" max-width="400">
			<v-card>
				<v-alert text dense border="left" color="info" icon="mdi-human-greeting">Editar Información</v-alert>
				<v-card-text>
					<v-text-field dense v-model="elementoEnEdicion.nombre" label="Nombre" outlined
						:rules="[v => !!v || 'El nombre es obligatorio']" />
					<v-text-field dense v-model="elementoEnEdicion.edad" label="Edad" type="number" outlined
						:rules="[v => !!v || 'La edad es obligatoria']" />
					<v-select dense v-model="elementoEnEdicion.objetivo_relacion" :items="opcionesRelaciones" no-data-text="Sin posibles relaciones"
						label="Relacionar con" outlined multiple />
					<v-select dense v-model="elementoEnEdicion.tipo_relacion" :items="tipoRelaciones"
						label="Tipo de Relación" outlined />
					<v-checkbox dense v-model="elementoEnEdicion.principal" label="Marcar como principal"></v-checkbox>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn small text @click="dialogoVisible = false" color="error">Cerrar</v-btn>
					<v-btn small color="success" :disabled="!esFormularioValido" @click="guardarAtributosElemento()">
						Guardar
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- Modal de información -->
		<v-dialog v-model="dialogInformacion" max-width="600px">
			<v-card>
				<!-- Título informativo -->
				<v-alert text dense border="left" color="blue-grey" icon="mdi-information-variant">
					Información general para el diseño de familiograma
				</v-alert>

				<v-card-text>
					<h3>1. Estructura del Panel de Familiograma</h3>
					<ol>
						<li>El panel de familiograma está dividido en tres secciones.</li>
						<li>En el lado izquierdo, se encuentran las herramientas representadas como:
							<ul>
								<li>Hombre</li>
								<li>Mujer</li>
								<li>No binario</li>
							</ul>
						</li>
					</ol>

					<h3>2. Funcionalidades de las Herramientas</h3>
					<ol>
						<li>
							Una vez que una herramienta es soltada en el panel de dibujo:
							<ul>
								<li>Se puede hacer clic sobre ella para diligenciar el nombre y la edad.</li>
								<li>Es posible identificar la figura principal de la consulta médica.</li>
								<li>Se pueden crear relaciones entre las figuras.</li>
							</ul>
						</li>
						<li>Las herramientas pueden moverse libremente por el panel de dibujo.</li>
					</ol>

					<h3>3. Uso de los Botones</h3>
					<ol>
						<li>
							<strong>Dibujar Libre:</strong> Permite realizar trazos punteados sobre el panel
							de dibujo.
						</li>
						<li>
							<strong>Dejar de Dibujar:</strong> Detiene la creación de trazos libres.
						</li>
						<li>
							<strong>Guardar Familiograma:</strong> Almacena la información del panel de dibujo
							en formato de imagen.
						</li>
					</ol>

					<h3>4. Consideraciones Adicionales</h3>
					<ol>
						<li>
							Para generar el familiograma:
							<ul>
								<li>Arrastra las herramientas al panel de dibujo, ubicado en el centro del panel.
								</li>
								<li>Utiliza los botones de iniciar y detener trazado libre según sea necesario.</li>
								<li>Guarda el familiograma al finalizar.</li>
							</ul>
						</li>
						<li>Una vez guardado el familiograma como imagen, no podrá ser modificado.</li>
					</ol>
				</v-card-text>

				<v-card-actions>
					<v-btn small color="info" @click="descargarGuia()">
						<v-icon left>mdi-download</v-icon>Descargar instructivo
					</v-btn>
					<v-spacer></v-spacer>
					<v-btn small color="error" text @click="dialogInformacion = false">Cerrar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
	import dragula from "dragula";
	import "dragula/dist/dragula.css";
	import html2canvas from "html2canvas";

	export default {
		props: ['datos', 'resumen'],
		data() {
			return {
				dialogInformacion: false,
				principal: false,
				mostrarWorkspace: true,
				imagenFamiliograma: null,
				dibujando: false,
				historialDibujo: [],
				lineasDibujadas: [],
				tools: [{
						id: 1,
						label: "Hombre",
						class: "cuadrado"
					},
					{
						id: 2,
						label: "Mujer",
						class: "circulo"
					},
					{
						id: 3,
						label: "No Binario",
						class: "rombo"
					},
				],
				dialogoVisible: false,
				elementoEnEdicion: {
					nombre: "",
					edad: "",
					objetivo_relacion: [],
					tipo_relacion: "",
					elementId: null,
					principal: false,
				},
				droppedElemento: [],
				opcionesRelaciones: [],
				tipoRelaciones: ["Matrimonio", "Unión libre", "Separación", "Divorcio"],
				selectedItem: null,
				figurasObtenidas: [],
			};
		},
		mounted() {
			this.obtenerFigura()
			const toolbox = this.$refs.toolbox;
			const workspace = this.$refs.workspace;

			const drake = dragula([toolbox, workspace], {
				copy: (el, source) => source === toolbox,
				accepts: (el, target) => target === workspace,
				copySortSource: false,
				removeOnSpill: true,
			});

			drake.on("drop", (el, target, source) => {
				if (target === workspace && source === toolbox) {
					const clone = el.cloneNode(true);
					clone.classList.add("workspace-item");
					clone.style.position = "absolute";

					const workspaceRect = workspace.getBoundingClientRect();
					const elRect = el.getBoundingClientRect();

					clone.style.left = `${elRect.left - workspaceRect.left}px`;
					clone.style.top = `${elRect.top - workspaceRect.top}px`;

					workspace.appendChild(clone);
					el.remove();

					const newId = `item-${Date.now()}`;
					clone.dataset.id = newId;

					this.elementoDraggable(clone);

					this.droppedElemento.push({
						id: newId,
						element: clone,
						class: clone.querySelector("span").className,
						nombre: "",
						edad: "",
						objetivo_relacion: null,
						tipo_relacion: "",
					});

					this.actualizarOpcionesRelacion();

					clone.addEventListener("click", () => {
						this.elementoSeleccionado(newId);
					});
				}
			});

			drake.on("drag", (el) => {
				el.style.opacity = "0.5";
			});

			drake.on("dragend", (el) => {
				el.style.opacity = "1";
			});
		},
		computed: {
			esFormularioValido() {
				return this.elementoEnEdicion.nombre && this.elementoEnEdicion.edad;
			},
		},

		methods: {
			activarDibujo() {
				this.dibujando = !this.dibujando;
			},

			comenzarDibujo(event) {
				if (!this.dibujando) return;

				this.dibujarLinea(event);
				const workspace = this.$refs.workspace;

				const onMouseMove = (e) => {
					if (this.dibujando) {
						this.dibujarLinea(e);
					}
				};

				const onMouseUp = () => {
					document.removeEventListener("mousemove", onMouseMove);
					document.removeEventListener("mouseup", onMouseUp);
				};

				document.addEventListener("mousemove", onMouseMove);
				document.addEventListener("mouseup", onMouseUp);
			},

			dibujarLinea(event) {
				const svgLayer = this.$refs.svgLayer;

				const workspaceRect = this.$refs.workspace.getBoundingClientRect();
				const x = event.clientX - workspaceRect.left;
				const y = event.clientY - workspaceRect.top;

				const line = document.createElementNS("http://www.w3.org/2000/svg", "circle");
				line.setAttribute("cx", x);
				line.setAttribute("cy", y);
				line.setAttribute("r", 2);
				line.setAttribute("fill", "black");

				svgLayer.appendChild(line);
			},
			dejarDeDibujar() {
				this.dibujando = false;
				console.log("Modo dibujo desactivado");
			},

			obtenerNombreIcono(className) {
				switch (className) {
					case "cuadrado":
						return "mdi-square-outline";
					case "circulo":
						return "mdi-circle-outline";
					case "rombo":
						return "mdi-square-outline";
					default:
						return "mdi-help";
				}
			},
			elementoDraggable(el) {
				el.addEventListener("mousedown", (event) => {
					const workspace = this.$refs.workspace;

					const offsetX = event.clientX - el.getBoundingClientRect().left;
					const offsetY = event.clientY - el.getBoundingClientRect().top;

					const onMouseMove = (moveEvent) => {
						const workspaceRect = workspace.getBoundingClientRect();
						const newX = moveEvent.clientX - workspaceRect.left - offsetX;
						const newY = moveEvent.clientY - workspaceRect.top - offsetY;

						el.style.left = `${newX}px`;
						el.style.top = `${newY}px`;

						this.actualizarConexion();
					};

					const onMouseUp = () => {
						document.removeEventListener("mousemove", onMouseMove);
						document.removeEventListener("mouseup", onMouseUp);
					};

					document.addEventListener("mousemove", onMouseMove);
					document.addEventListener("mouseup", onMouseUp);
				});
			},
			elementoSeleccionado(id) {
				this.droppedElemento.forEach((item) => {
					item.element.classList.remove("selected");
				});

				const selectedItem = this.droppedElemento.find((item) => item.id === id);
				if (selectedItem) {
					selectedItem.element.classList.add("selected");
					this.selectedItem = selectedItem;
					this.abrirDialogo(id);
				}
			},
			abrirDialogo(id) {
				const item = this.droppedElemento.find((item) => item.id === id);
				if (item) {
					this.elementoEnEdicion = {
						...item,
						elementId: id
					};
					this.dialogoVisible = true;
				}
			},
			async guardarAtributosElemento() {
				const item = this.droppedElemento.find((item) => item.id === this.elementoEnEdicion.elementId);
				if (item) {
					Object.assign(item, this.elementoEnEdicion);
					item.pos_x = event.pageX;
					item.pos_y = event.pageY;

					const figura = {
						nombre: item.nombre,
						edad: item.edad,
						consulta_id: this.datos.id,
						class: item.class,
						pos_x: item.pos_x || 0,
						pos_y: item.pos_y || 0,
					};

					if (!isNaN(Number(item.id))) {
						await this.actualizarFigura(figura);
					} else {
						await this.guardarFigura(figura, item);
					}

					if (item.objetivo_relacion && item.objetivo_relacion.length > 0) {
						await this.guardarRelacion(item);
					}

					const element = item.element;
					element.innerHTML = `
        <div>
            <small>${item.nombre}</small>
            <small>${item.edad}</small>
        </div>
        `;
					const figuraClass = `workspace-item ${item.class}`;
					element.className = item.principal ?
						`${figuraClass} borde-doble` :
						figuraClass;
					this.actualizarConexion();
				}
				this.dialogoVisible = false;
			},
			async guardarRelacion(item) {
				try {
					const relaciones = item.objetivo_relacion.map((relacionId) => ({
						figura_origen_id: item.id,
						figura_destino_id: relacionId,
						tipo_relacion: item.tipo_relacion,
					}));

					await this.$axios.post('/relaciones/crearRelacion', {
						relaciones
					});

					console.log("Relación guardada exitosamente");
				} catch (error) {
					console.error("Error al guardar relación:", error.response ?.data || error.message);
				}
			},
			actualizarOpcionesRelacion() {
				this.opcionesRelaciones = this.droppedElemento
					.filter(item => item.nombre && item.nombre.trim() !== '')
					.map(item => ({
						text: item.nombre,
						value: item.id,
					}));
			},
			actualizarConexion() {
				const svgLayer = this.$refs.svgLayer;

				const lineasExistentes = svgLayer.querySelectorAll("line");
				lineasExistentes.forEach((line) => line.remove());

				// Define las dimensiones y puntos de unión
				const nodeWidth = 70;
				const nodeHeight = 70;
				const connectionOffsets = {
					top: {
						x: nodeWidth / 2,
						y: 0
					},
					bottom: {
						x: nodeWidth / 2,
						y: nodeHeight
					},
					left: {
						x: 0,
						y: nodeHeight / 2
					},
					right: {
						x: nodeWidth,
						y: nodeHeight / 2
					},
				};

				const conexionesRecorrer = new Map();

				this.droppedElemento.forEach((item) => {
					if (item.objetivo_relacion && item.objetivo_relacion.length > 0) {
						const itemX = parseInt(item.element.style.left);
						const itemY = parseInt(item.element.style.top);

						const itemConnections = {
							top: {
								x: itemX + connectionOffsets.top.x,
								y: itemY + connectionOffsets.top.y
							},
							bottom: {
								x: itemX + connectionOffsets.bottom.x,
								y: itemY + connectionOffsets.bottom.y
							},
							left: {
								x: itemX + connectionOffsets.left.x,
								y: itemY + connectionOffsets.left.y
							},
							right: {
								x: itemX + connectionOffsets.right.x,
								y: itemY + connectionOffsets.right.y
							},
						};

						const lineasCentradas = item.objetivo_relacion.map((relatedId) => {
							const elementoRelacionado = this.droppedElemento.find((i) => i.id ===
								relatedId);
							if (elementoRelacionado) {
								const relX = parseInt(elementoRelacionado.element.style.left);
								const relY = parseInt(elementoRelacionado.element.style.top);

								return {
									id: relatedId,
									connections: {
										top: {
											x: relX + connectionOffsets.top.x,
											y: relY + connectionOffsets.top.y
										},
										bottom: {
											x: relX + connectionOffsets.bottom.x,
											y: relY + connectionOffsets.bottom.y
										},
										left: {
											x: relX + connectionOffsets.left.x,
											y: relY + connectionOffsets.left.y
										},
										right: {
											x: relX + connectionOffsets.right.x,
											y: relY + connectionOffsets.right.y
										},
									},
								};
							}
							return null;
						}).filter(Boolean);

						if (lineasCentradas.length > 1) {
							const posCentroX = lineasCentradas.reduce((sum, rel) => sum + rel.connections.top.x, 0) /
								lineasCentradas.length;
							const posCentroY = lineasCentradas.reduce((sum, rel) => sum + rel.connections.top.y, 0) /
								lineasCentradas.length;

							lineasCentradas.forEach((related) => {
								const connectionKey = [item.id, related.id].sort().join("-");
								if (conexionesRecorrer.has(connectionKey)) return;

								// Línea desde el punto intermedio al objetivo relacionado
								this.dibujarLineaConexion(svgLayer, posCentroX, posCentroY, related.connections
									.top.x, related.connections.top.y);
								conexionesRecorrer.set(connectionKey, true);
							});

							// Línea desde el punto intermedio al nodo principal
							this.dibujarLineaConexion(svgLayer, posCentroX, posCentroY, itemConnections.top.x,
								itemConnections.top.y);
						} else {
							// Conexión directa si solo hay un objetivo relacionado
							lineasCentradas.forEach((related) => {
								const connectionKey = [item.id, related.id].sort().join("-");
								if (conexionesRecorrer.has(connectionKey)) return;

								const line = this.dibujarLineaConexion(
									svgLayer,
									itemConnections.top.x,
									itemConnections.top.y,
									related.connections.top.x,
									related.connections.top.y
								);
								conexionesRecorrer.set(connectionKey, true);
							});
						}
					}
				});
			},

			dibujarLineaConexion(svgLayer, x1, y1, x2, y2) {
				const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
				line.setAttribute("x1", x1);
				line.setAttribute("y1", y1);
				line.setAttribute("x2", x2);
				line.setAttribute("y2", y2);
				line.setAttribute("stroke", "black");
				line.setAttribute("stroke-width", 2);
				svgLayer.appendChild(line);
				return line;
			},

			async guardarFigura(figura, item) {
				try {
					const response = await this.$axios.post('/figuras/crearFigura', figura);
					figura.id = response.data.id;
					console.log("Figura guardada exitosamente:", response.data);

					item.id = figura.id;

					//   await this.obtenerFigura();

				} catch (error) {
					console.error("Error al guardar figura:", error.response ?.data || error.message);
				}
			},
			async actualizarFigura(figura) {
				try {
					const response = await this.$axios.put(`/figuras/${figura.id}`, figura);
					console.log("Figura actualizada exitosamente:", response.data);
				} catch (error) {
					console.error("Error al actualizar figura:", error.response ?.data || error.message);
				}
			},
			descargarGuia() {
				this.$axios.get('figuras/guia', {
					responseType: "arraybuffer"
				}).then(res => {
					let blob = new Blob([res.data], {
						type: "application/pdf"
					});
					let link = document.createElement("a");
					link.href = window.URL.createObjectURL(blob);
					window.open(link.href, "_blank");
				});
			},
			async obtenerFigura() {
				try {
					const response = await this.$axios.post('/figuras/obtenerFigura', {
						consulta_id: this.datos.id
					});
					this.figurasObtenidas = response.data;
					this.crearFigurasObtenidas();
				} catch (error) {
					console.error("Error al guardar figura:", error.response ?.data || error.message);
				}
			},
			crearFigurasObtenidas() {
				const workspace = this.$refs.workspace;

				this.figurasObtenidas.forEach((figura) => {
					const elemento = document.createElement('div');
					console.log('creando', elemento);
					elemento.className = `workspace-item ${figura.class}`;
					const scopeId = this.$el.getAttributeNames().find(attr => attr.startsWith('data-v-'));
					if (scopeId) {
						elemento.setAttribute(scopeId, '');
					}
					elemento.style.position = 'absolute';
					//   elemento.style.left = `${figura.pos_x}px`;
					//   elemento.style.top = `${figura.pos_y}px`;
					elemento.dataset.id = figura.id;
					elemento.dataset.type = figura.class;

					elemento.innerHTML = `
        <div>
          <small>${figura.nombre}</small>
          <small>${figura.edad}</small>
        </div>
      `;

					workspace.appendChild(elemento);

					this.droppedElemento.push({
						id: figura.id,
						element: elemento,
						class: figura.class,
						nombre: figura.nombre,
						edad: figura.edad,
						objetivo_relacion: figura.objetivo_relacion || [],
						tipo_relacion: figura.tipo_relacion || '',
					});

					this.elementoDraggable(elemento);

					elemento.addEventListener('click', () => {
						this.elementoSeleccionado(figura.id);
					});
				});

				this.actualizarOpcionesRelacion();
			},

			async guardarFamiliograma() {
				try {
					const workspace = this.$refs.workspace;

					const canvas = await html2canvas(workspace, {
						backgroundColor: null,
					});

					const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg"));

					if (!blob) {
						console.error("Error al generar la imagen.");
						this.$toast.error("No se pudo generar la imagen del familiograma.");
						return;
					}

					const formData = new FormData();
					formData.append("imagen", blob, "familiograma.jpg");
					formData.append("consulta_id", this.datos.id);

					const guardarResponse = await this.$axios.post("figuras/guardarImagen", formData, {
						headers: {
							"Content-Type": "multipart/form-data",
						},
					});

					if (guardarResponse.data && guardarResponse.data.consulta_id) {
						const consultaResponse = await this.$axios.post("figuras/consultarImagen", {
							consulta_id: guardarResponse.data.consulta_id,
						}, );
						this.imagenFamiliograma = consultaResponse.data;
						this.mostrarWorkspace = false;
						this.$toast.success("Familiograma guardado exitosamente.");
					} else {
						console.error("Error al guardar el familiograma:", guardarResponse.data ||
							"Respuesta inválida.");
						this.$toast.error("Hubo un problema al guardar el familiograma.");
					}
				} catch (error) {
					console.error("Error al guardar el familiograma:", error);
					this.$toast.error("Hubo un problema al guardar el familiograma.");
				}
			}

		},
	};

</script>

<style scoped>
	.toolbox {
		background-color: #f5f5f5;
		padding: 10px;
		height: 220px;
	}

	.workspace {
		position: relative;
		height: 500px;
		background-color: #eaeaea;
		overflow: hidden;
		text-align: center;
	}

	.workspace-item {
		width: 75px;
		height: 75px;
		border: 2px solid black;
		text-align: center;
		line-height: 75px;
		cursor: pointer;
	}

	.circulo {
		border-radius: 50%;
	}

	.cuadrado {
		border-radius: 5%;
	}

	.rombo {
		position: absolute;
		transform: rotate(45deg);
	}

	.circulo,
	.cuadrado,
	.rombo {
		cursor: grab;
	}

	.circulo:active,
	.cuadrado:active,
	.rombo:active {
		cursor: grabbing;
	}

	.svg-layer {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	.selected {
		border-color: blue;
	}

	.borde-doble {
		position: relative;
		border: 2px solid black;
		margin: -20px;
	}

	.borde-doble::before {
		content: "";
		position: absolute;
		top: 3px;
		left: 3px;
		right: 3px;
		bottom: 3px;
		border: 2px solid black;
		pointer-events: none;
	}

	.borde-doble.circulo::before {
		border-radius: 50%;
	}

	.borde-doble.cuadrado::before {
		border-radius: 5%;
	}

	.borde-doble.rombo::before {
		transform: rotate(90deg);
	}

	.bouncing-icon {
		animation: bounce 3s infinite;
	}

	@keyframes bounce {

		0%,
		100% {
			transform: translateY(0);
		}

		50% {
			transform: translateY(-5px);
		}
	}

</style>
