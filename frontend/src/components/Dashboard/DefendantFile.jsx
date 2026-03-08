import React, { useState, useEffect } from 'react'
import {
  FileText,
  Download,
  Eye,
  Upload,
  Trash2,
  File,
  Image,
  Film,
  FileArchive,
  Search,
  Filter,
  Calendar,
  User,
  Car,
  Phone,
  Mail,
  MapPin,
  X,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Clock
} from 'lucide-react'

// File type icons
const getFileIcon = (fileType) => {
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
  const videoTypes = ['mp4', 'webm', 'mov', 'avi']
  const archiveTypes = ['zip', 'rar', '7z', 'tar', 'gz']

  const ext = fileType?.toLowerCase() || ''

  if (imageTypes.some(t => ext.includes(t))) return { icon: Image, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' }
  if (videoTypes.some(t => ext.includes(t))) return { icon: Film, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' }
  if (archiveTypes.some(t => ext.includes(t))) return { icon: FileArchive, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' }
  return { icon: File, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' }
}

// Status badge
const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  court: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  disputed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  closed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  paid: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
}

// Mock defendant files data
const mockDefendantFiles = [
  {
    id: 1,
    defendant: {
      firstname: 'John',
      lastname: 'Smith',
      id_no: '19900101001',
      license_no: 'NAM-LIC-001234',
      phone_number: '+264 81 123 4567',
      email: 'john.smith@email.com',
      physical_address: '123 Independence Avenue, Windhoek',
      city: 'Windhoek'
    },
    cases: [
      {
        id: 1,
        ticket_number: 'NAM-2024-000001',
        plate_no: 'N 12345',
        violation_type: 'speeding',
        amount: 500,
        status: 'court',
        date: '2024-01-15T10:30:00',
        location: 'Independence Avenue'
      },
      {
        id: 2,
        ticket_number: 'NAM-2024-000045',
        plate_no: 'N 12345',
        violation_type: 'illegal_parking',
        amount: 300,
        status: 'pending',
        date: '2024-02-20T14:00:00',
        location: 'Post Street Mall'
      }
    ],
    files: [
      {
        id: 1,
        name: 'ID_Copy.jpg',
        type: 'photo',
        size: '2.4 MB',
        uploaded_at: '2024-01-20',
        description: 'Copy of Identity Document'
      },
      {
        id: 2,
        name: 'License_Copy.pdf',
        type: 'document',
        size: '156 KB',
        uploaded_at: '2024-01-20',
        description: 'Driver License'
      },
      {
        id: 3,
        name: 'Evidence_Photo1.jpg',
        type: 'photo',
        size: '3.1 MB',
        uploaded_at: '2024-01-15',
        description: 'Traffic violation photo evidence'
      }
    ]
  },
  {
    id: 2,
    defendant: {
      firstname: 'Maria',
      lastname: 'Nakamura',
      id_no: '19920515002',
      license_no: 'NAM-LIC-002345',
      phone_number: '+264 81 987 6543',
      email: 'maria.n@email.com',
      physical_address: '45 Church Street, Swakopmund',
      city: 'Swakopmund'
    },
    cases: [
      {
        id: 3,
        ticket_number: 'NAM-2024-000089',
        plate_no: 'N 54321',
        violation_type: 'red_light',
        amount: 750,
        status: 'disputed',
        date: '2024-02-10T09:15:00',
        location: 'Mandume Road Intersection'
      }
    ],
    files: [
      {
        id: 4,
        name: 'Defense_Statement.pdf',
        type: 'document',
        size: '89 KB',
        uploaded_at: '2024-02-12',
        description: 'Written defense statement'
      },
      {
        id: 5,
        name: 'Witness_Statement.pdf',
        type: 'document',
        size: '124 KB',
        uploaded_at: '2024-02-12',
        description: 'Witness testimony'
      }
    ]
  }
]

// File Preview Modal
function FilePreviewModal({ file, onClose }) {
  if (!file) return null

  const { icon: Icon, color, bg } = getFileIcon(file.type)

  const isImage = file.type?.includes('photo') || file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${bg}`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white">{file.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{file.size} • {file.uploaded_at}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 flex items-center justify-center bg-slate-100 dark:bg-slate-900 min-h-[400px]">
          {isImage ? (
            <div className="text-center">
              <div className="w-64 h-64 bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center mb-4">
                <Image className="w-16 h-16 text-slate-400" />
              </div>
              <p className="text-slate-500 dark:text-slate-400">Image preview not available</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-64 h-64 bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-16 h-16 text-slate-400" />
              </div>
              <p className="text-slate-500 dark:text-slate-400">Document preview not available</p>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 mx-auto">
                <Download className="w-4 h-4" /> Download to View
              </button>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-600 dark:text-slate-300">{file.description}</p>
        </div>
      </div>
    </div>
  )
}

// Defendant Card
function DefendantCard({ defendant, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        p-4 rounded-xl border cursor-pointer transition-all
        ${isSelected
          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-md'
          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isSelected ? 'bg-blue-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
        }`}>
          <User className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-800 dark:text-white">
            {defendant.firstname} {defendant.lastname}
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">ID: {defendant.id_no}</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Car className="w-3 h-3" />
            <span>{defendant.cases?.length || 0} cases</span>
          </div>
        </div>
        {isSelected && <ChevronRight className="w-5 h-5 text-blue-500" />}
      </div>
    </div>
  )
}

// Defendant Detail View
function DefendantDetail({ defendant, onBack, onFileClick }) {
  const [activeTab, setActiveTab] = useState('cases')

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
          <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Defendant Profile</h3>
      </div>

      {/* Defendant Info */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
            {defendant.firstname[0]}{defendant.lastname[0]}
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400">Full Name</label>
              <p className="font-medium text-slate-800 dark:text-white">{defendant.firstname} {defendant.lastname}</p>
            </div>
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400">ID Number</label>
              <p className="font-medium text-slate-800 dark:text-white">{defendant.id_no}</p>
            </div>
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400">License Number</label>
              <p className="font-medium text-slate-800 dark:text-white">{defendant.license_no}</p>
            </div>
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400">Phone</label>
              <p className="font-medium text-slate-800 dark:text-white flex items-center gap-1">
                <Phone className="w-3 h-3" /> {defendant.phone_number}
              </p>
            </div>
            <div className="col-span-2">
              <label className="text-xs text-slate-500 dark:text-slate-400">Email</label>
              <p className="font-medium text-slate-800 dark:text-white flex items-center gap-1">
                <Mail className="w-3 h-3" /> {defendant.email}
              </p>
            </div>
            <div className="col-span-2">
              <label className="text-xs text-slate-500 dark:text-slate-400">Address</label>
              <p className="font-medium text-slate-800 dark:text-white flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {defendant.physical_address}, {defendant.city}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('cases')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'cases'
              ? 'bg-blue-500 text-white'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
          }`}
        >
          Cases ({defendant.cases?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('files')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'files'
              ? 'bg-blue-500 text-white'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
          }`}
        >
          Files ({defendant.files?.length || 0})
        </button>
      </div>

      {/* Cases Tab */}
      {activeTab === 'cases' && (
        <div className="space-y-3">
          {defendant.cases?.map(caseItem => (
            <div key={caseItem.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white">{caseItem.ticket_number}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <Car className="w-3 h-3" /> {caseItem.plate_no}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[caseItem.status] || statusColors.pending}`}>
                  {caseItem.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400">Violation</label>
                  <p className="text-slate-800 dark:text-white capitalize">{caseItem.violation_type?.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400">Fine</label>
                  <p className="text-slate-800 dark:text-white font-bold">N${caseItem.amount}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-slate-500 dark:text-slate-400">Location</label>
                  <p className="text-slate-800 dark:text-white">{caseItem.location}</p>
                </div>
              </div>
            </div>
          ))}
          {(!defendant.cases || defendant.cases.length === 0) && (
            <p className="text-center py-8 text-slate-500 dark:text-slate-400">No cases found</p>
          )}
        </div>
      )}

      {/* Files Tab */}
      {activeTab === 'files' && (
        <div className="space-y-3">
          {defendant.files?.map(file => {
            const { icon: Icon, color, bg } = getFileIcon(file.type)
            return (
              <div
                key={file.id}
                onClick={() => onFileClick(file)}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 cursor-pointer hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${bg}`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-800 dark:text-white truncate">{file.name}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{file.description}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                      <span>{file.size}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {file.uploaded_at}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                      <Eye className="w-4 h-4 text-slate-500" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                      <Download className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
          {(!defendant.files || defendant.files.length === 0) && (
            <p className="text-center py-8 text-slate-500 dark:text-slate-400">No files uploaded</p>
          )}
        </div>
      )}
    </div>
  )
}

// Main Component
export default function DefendantFile() {
  const [defendants] = useState(mockDefendantFiles)
  const [selectedDefendant, setSelectedDefendant] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)

  const filteredDefendants = defendants.filter(d => {
    const fullName = `${d.defendant.firstname} ${d.defendant.lastname}`.toLowerCase()
    const query = searchQuery.toLowerCase()
    return fullName.includes(query) ||
      d.defendant.id_no.includes(query) ||
      d.defendant.email.toLowerCase().includes(query)
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <span className="px-4 py-1.5 bg-yellow-500 text-indigo-900 text-sm font-bold rounded-lg shadow-lg flex items-center gap-2">
              <User className="w-4 h-4" /> DEFENDANT
            </span>
            <div>
              <h1 className="text-2xl font-bold">Defendant Files</h1>
              <p className="text-indigo-100 text-sm">
                Manage defendant records and case files
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium flex items-center gap-2">
              <Upload className="w-4 h-4" /> Upload File
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <User className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{defendants.length}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Defendants</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-900/30">
              <FileText className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                {defendants.reduce((acc, d) => acc + (d.cases?.length || 0), 0)}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Cases</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-green-100 dark:bg-green-900/30">
              <FileText className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                {defendants.reduce((acc, d) => acc + (d.files?.length || 0), 0)}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Files</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-yellow-100 dark:bg-yellow-900/30">
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                {defendants.reduce((acc, d) => acc + (d.cases?.filter(c => c.status === 'court').length || 0), 0)}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Pending Court</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Defendant List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search defendants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* List */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredDefendants.map(defendant => (
              <DefendantCard
                key={defendant.id}
                defendant={defendant.defendant}
                isSelected={selectedDefendant?.id === defendant.id}
                onClick={() => setSelectedDefendant(defendant)}
              />
            ))}
            {filteredDefendants.length === 0 && (
              <p className="text-center py-8 text-slate-500 dark:text-slate-400">No defendants found</p>
            )}
          </div>
        </div>

        {/* Detail View */}
        <div className="lg:col-span-2">
          {selectedDefendant ? (
            <DefendantDetail
              defendant={selectedDefendant.defendant}
              onBack={() => setSelectedDefendant(null)}
              onFileClick={setSelectedFile}
            />
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
              <User className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Select a Defendant</h3>
              <p className="text-slate-500 dark:text-slate-400">Choose a defendant from the list to view their profile, cases, and files</p>
            </div>
          )}
        </div>
      </div>

      {/* File Preview Modal */}
      {selectedFile && (
        <FilePreviewModal
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </div>
  )
}

