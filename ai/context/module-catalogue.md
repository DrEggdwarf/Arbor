# Catalogue des modules Arbor

> Référence exhaustive de tous les blocs par catégorie.
> Statut : ✅ fait | 🔲 à faire

---

## content — Contenu

| # | Type | Label | Statut |
|---|------|-------|--------|
| 1 | `section-title` | Titre de section | ✅ |
| 2 | `text` | Texte | ✅ |
| 3 | `code` | Code | ✅ |
| 4 | `table` | Tableau | ✅ |
| 5 | `callout` | Encart | ✅ |

## layout — Mise en page

| # | Type | Label | Statut |
|---|------|-------|--------|
| 1 | `separator` | Séparateur | ✅ |
| 2 | `spacer` | Espacement | ✅ |
| 3 | `horizontal-div` | Colonnes | ✅ |
| 4 | `drawer` | Dépliable | ✅ |

## media — Médias

| # | Type | Label | Statut |
|---|------|-------|--------|
| 1 | `image` | Image | ✅ |

---

## pentest — Tests d'intrusion

| # | Type | Label | Description | Statut |
|---|------|-------|-------------|--------|
| 1 | `score-gauge` | Scores | Jauges segmentées 9 barres avec tooltip | ✅ |
| 2 | `risk-matrix` | Matrice de risques | Grille 3×3 colorée avec points | ✅ |
| 3 | `risk-assessment` | Évaluation des risques | OWASP combiné (vraisemblance + impact + matrice) | ✅ |
| 4 | `vulnerability-card` | Fiche vulnérabilité | Titre, sévérité badge, CVSS, description, impact, remédiation, preuves, refs CVE | ✅ |
| 5 | `cve-table` | Tableau CVE | ID, CVSS, sévérité colorée, produit, statut | ✅ |
| 6 | `cvss-calculator` | Vecteur CVSS | Gauge circulaire CVSS 3.1/4.0 + détail métriques | ✅ |
| 7 | `attack-timeline` | Kill Chain | Timeline MITRE ATT&CK, étapes horizontales colorées par phase | ✅ |
| 8 | `scope-block` | Périmètre d'audit | IPs, domaines, URLs, exclusions — layout structuré avec icônes | ✅ |
| 9 | `findings-summary` | Synthèse des trouvailles | N critiques/élevés/moyens/faibles avec barres horizontales | ✅ |
| 10 | `recommendation` | Recommandation | Titre, priorité badge, effort, description, statut | ✅ |
| 11 | `attack-path` | Chemin d'attaque | Graphe : nœuds (machine/service) reliés par flèches annotées (exploit) | ✅ |
| 12 | `credentials-table` | Identifiants trouvés | Service, username, password masquable, source, force | ✅ |
| 13 | `privilege-escalation` | Escalade de privilèges | Diagramme vertical : user → admin → root avec étapes | ✅ |

## network — Infrastructure & Réseau

| # | Type | Label | Description | Statut |
|---|------|-------|-------------|--------|
| 1 | `network-topology` | Topologie réseau | Schéma réseau isométrique SVG : serveurs, routeurs, firewalls, zones | ✅ |
| 2 | `port-scan-table` | Scan de ports | Résultats nmap : IP, port, protocole, service, version, état coloré | ✅ |
| 3 | `firewall-rules` | Règles firewall | Source, dest, port, protocole, action allow/deny coloré | ✅ |
| 4 | `vlan-diagram` | Diagramme VLAN | Segments colorés avec machines rattachées | ✅ |
| 5 | `network-flow` | Flux réseau | Diagramme Sankey-like : source → destination avec volume | ✅ |
| 6 | `architecture-diagram` | Architecture | Schéma d'architecture : boîtes + flèches + labels | ✅ |
| 7 | `server-inventory` | Inventaire serveurs | Hostname, IP, OS, rôle, patch level, statut | ✅ |
| 8 | `dns-records` | Enregistrements DNS | A, AAAA, MX, CNAME, TXT, NS structurés | ✅ |
| 9 | `certificate-info` | Certificat TLS | Émetteur, sujet, validité, algo, chaîne de confiance vert/rouge | ✅ |
| 10 | `subnet-map` | Carte sous-réseau | Plage IP avec machines occupées/libres (grille colorée) | ✅ |
| 11 | `cloud-architecture` | Architecture cloud | Diagramme AWS/Azure/GCP avec icônes services | ✅ |
| 12 | `wireless-survey` | Audit Wi-Fi | SSIDs, puissance signal, chiffrement, canal (tableau + radar) | ✅ |

## grc — Gouvernance, Risque, Conformité

| # | Type | Label | Description | Statut |
|---|------|-------|-------------|--------|
| 1 | `ebios-feared-events` | Événements redoutés | EBIOS RM : sources de risque, objectifs, gravité | ✅ |
| 2 | `ebios-scenarios` | Scénarios EBIOS | Scénarios stratégiques et opérationnels avec vraisemblance | ✅ |
| 3 | `ebios-target` | Cible de sécurité | EBIOS RM : valeurs métiers, biens supports, menaces | ✅ |
| 4 | `compliance-checklist` | Checklist conformité | ISO 27001/NIST/PCI-DSS : contrôle, statut ✅❌⚠️, commentaire | ✅ |
| 5 | `gap-analysis` | Analyse d'écart | Domaine, niveau actuel vs cible (barres comparatives) | ✅ |
| 6 | `risk-register` | Registre de risques | ID, description, probabilité, impact, niveau résiduel, propriétaire | ✅ |
| 7 | `maturity-radar` | Radar de maturité | Toile d'araignée : axes domaines, maturité 1-5, actuel vs cible | ✅ |
| 8 | `action-plan` | Plan d'action | Timeline horizontale avec jalons colorés par priorité | ✅ |
| 9 | `raci-matrix` | Matrice RACI | Activités × rôles, cellules R/A/C/I colorées | ✅ |
| 10 | `risk-appetite` | Appétit au risque | Zones acceptable/tolérable/inacceptable sur échelle | ✅ |
| 11 | `control-matrix` | Matrice des contrôles | Menace × contrôle avec couverture colorée | ✅ |
| 12 | `compliance-gauge` | Jauge de conformité | Donut segmenté par domaine de conformité | ✅ |

## hardware — Sécurité matérielle & IoT

| # | Type | Label | Description | Statut |
|---|------|-------|-------------|--------|
| 1 | `circuit-diagram` | Schéma circuit | Circuit électrique simplifié SVG : composants + connexions | 🔲 |
| 2 | `pin-diagram` | Brochage | Chip avec labels sur chaque pin | 🔲 |
| 3 | `signal-waveform` | Oscillogramme | Signal numérique/analogique : timeline + amplitude | 🔲 |
| 4 | `hardware-block-diagram` | Architecture HW | CPU, mémoire, bus, périphériques, connexions | 🔲 |
| 5 | `photo-annotation` | Photo annotée | Photo matérielle avec marqueurs numérotés + légendes | 🔲 |
| 6 | `component-card` | Fiche composant | Nom, fabricant, datasheet, vulns, firmware version | 🔲 |
| 7 | `memory-map` | Carte mémoire | Adresses, segments code/data/stack, zones protégées | 🔲 |
| 8 | `bus-protocol` | Protocole bus | Chronogramme I2C/SPI/UART/JTAG simplifié | 🔲 |
| 9 | `firmware-diff` | Diff firmware | Comparaison avant/après avec diff coloré | 🔲 |
| 10 | `physical-access-plan` | Plan d'accès physique | Plan bâtiment simplifié avec zones de sécurité | 🔲 |

## osint — Renseignement en source ouverte

| # | Type | Label | Description | Statut |
|---|------|-------|-------------|--------|
| 1 | `port-scan-visual` | Scan ports visuel | Cercle/grille avec ports ouverts/fermés/filtrés | 🔲 |
| 2 | `relationship-graph` | Graphe de liens | Nœuds (personnes, orgs, domaines, IPs) + liens typés | 🔲 |
| 3 | `geo-map` | Carte géographique | Carte centrée sur région avec pins + légendes | 🔲 |
| 4 | `domain-info` | Fiche domaine | Registrar, dates, nameservers, sous-domaines | 🔲 |
| 5 | `whois-card` | Fiche WHOIS | Registrant, admin, tech, dates, statuts | 🔲 |
| 6 | `ip-geolocation` | Géolocation IP | Géoloc, ASN, ISP, reputation, carte mini | 🔲 |
| 7 | `email-header-analysis` | Analyse en-têtes email | Route hops, SPF/DKIM/DMARC, timestamps | 🔲 |
| 8 | `social-profile` | Profil social | Avatar, pseudo, plateforme, bio, stats, liens | 🔲 |
| 9 | `metadata-viewer` | Métadonnées fichier | EXIF, PDF metadata, Office properties | 🔲 |
| 10 | `timeline` | Frise chronologique | Dates + descriptions + sources sur axe temporel | 🔲 |
| 11 | `subdomain-tree` | Arborescence sous-domaines | Tree view avec IPs et statuts | 🔲 |
| 12 | `data-breach-card` | Fiche data breach | Source, date, données exposées, volume, impact | 🔲 |
| 13 | `screenshot-annotated` | Capture annotée | Screenshot web/app avec zones annotées | 🔲 |

## graph — Graphiques & Dataviz

| # | Type | Label | Description | Statut |
|---|------|-------|-------------|--------|
| 1 | `line-chart` | Graphique en lignes | Évolution temporelle, tendances | ✅ |
| 2 | `bar-chart` | Diagramme en barres | Barres verticales ou horizontales | ✅ |
| 3 | `pie-chart` | Camembert | Donut chart / pie chart | ✅ |
| 4 | `radar-chart` | Radar | Toile d'araignée polyvalente | ✅ |
| 5 | `scatter-plot` | Nuage de points | Corrélation entre 2 variables | ✅ |
| 6 | `heatmap` | Carte de chaleur | Matrice colorée | ✅ |
| 7 | `stacked-bar` | Barres empilées | Composition par catégorie | ✅ |
| 8 | `area-chart` | Graphique en aires | Évolution cumulée | ✅ |
| 9 | `treemap` | Treemap | Proportions hiérarchiques | ✅ |
| 10 | `gauge-chart` | Jauge circulaire | KPI, score global | ✅ |
| 11 | `sankey-diagram` | Diagramme Sankey | Flux entre catégories | ✅ |
| 12 | `sparkline` | Sparkline | Mini graphique inline (dans texte ou tableau) | ✅ |
| 13 | `waterfall-chart` | Cascade | Décomposition d'un total | ✅ |
| 14 | `funnel-chart` | Entonnoir | Étapes d'un processus avec taux | ✅ |

## forensics — Investigation numérique

| # | Type | Label | Description | Statut |
|---|------|-------|-------------|--------|
| 1 | `disk-image-map` | Carte de disque | Partitions, espace occupé/libre/supprimé | 🔲 |
| 2 | `file-timeline` | Timeline fichiers | Création/modification/accès sur axe temporel | 🔲 |
| 3 | `registry-viewer` | Registre Windows | Arbre de clés avec valeurs surlignées | 🔲 |
| 4 | `process-tree` | Arborescence processus | PID, PPID, commandline, timestamps | 🔲 |
| 5 | `log-viewer` | Visualiseur de logs | Timestamp, level, source, message filtrable | 🔲 |
| 6 | `ioc-table` | Tableau IOC | Type hash/IP/domain/URL, valeur, source, confiance | 🔲 |
| 7 | `chain-of-custody` | Chaîne de traçabilité | Étapes datées, responsable, hash intégrité | 🔲 |
| 8 | `hex-viewer` | Affichage hexadécimal | Offset + hex + ASCII avec zones surlignées | 🔲 |
| 9 | `malware-summary` | Fiche malware | Nom, famille, type, hashes, comportements, IOCs | 🔲 |
| 10 | `event-correlation` | Corrélation événements | Sources × timeline avec liens | 🔲 |

## social-engineering — Ingénierie sociale

| # | Type | Label | Description | Statut |
|---|------|-------|-------------|--------|
| 1 | `phishing-stats` | Stats phishing | Envoyés, ouverts, cliqués, soumis (funnel + barres) | 🔲 |
| 2 | `email-template` | Template email | Aperçu email phishing avec annotations red flags | 🔲 |
| 3 | `awareness-score` | Score sensibilisation | Par département, barres groupées + target | 🔲 |
| 4 | `pretext-scenario` | Scénario prétexte | Étapes + rôle + objectif + résultat (timeline cards) | 🔲 |
| 5 | `badge-cloning` | Clonage badge | Photo badge + données extraites + accès obtenus | 🔲 |
| 6 | `vishing-log` | Journal vishing | Script, réponses, infos obtenues | 🔲 |

---

## Statistiques

| Catégorie | Total | ✅ | 🔲 |
|-----------|-------|-----|-----|
| content | 5 | 5 | 0 |
| layout | 4 | 4 | 0 |
| media | 1 | 1 | 0 |
| pentest | 13 | 13 | 0 |
| network | 12 | 12 | 0 |
| grc | 12 | 12 | 0 |
| hardware | 10 | 0 | 10 |
| osint | 13 | 0 | 13 |
| graph | 14 | 14 | 0 |
| forensics | 10 | 0 | 10 |
| social-engineering | 6 | 0 | 6 |
| **TOTAL** | **100** | **61** | **39** |
