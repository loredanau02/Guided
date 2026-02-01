import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../../config/firebase'
import Card, { CardBody } from '../../common/Card'
import SearchBar from '../../common/SearchBar'
import LoadingSpinner from '../../common/LoadingSpinner'
import EmptyState from '../../common/EmptyState'
import type { User } from '../../../types'
import { ROUTES } from '../../../utils/constants'
import { getInitials } from '../../../utils/helpers'

export default function StudentList() {
  const navigate = useNavigate()
  const [students, setStudents] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function loadStudents() {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'student'))
        const snap = await getDocs(q)
        setStudents(snap.docs.map(d => ({ uid: d.id, ...d.data() } as User)))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadStudents()
  }, [])

  const filtered = students.filter(s =>
    s.displayName.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <LoadingSpinner className="py-20" />

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Students</h1>
      <SearchBar value={search} onChange={setSearch} placeholder="Search students..." className="mb-6" />

      {filtered.length === 0 ? (
        <EmptyState title="No students found" description="Students who register will appear here" />
      ) : (
        <div className="space-y-3">
          {filtered.map(student => (
            <Card key={student.uid} hover onClick={() => navigate(ROUTES.TEACHER.STUDENT_DETAIL(student.uid))}>
              <CardBody className="flex items-center gap-4">
                <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-sage-700">{getInitials(student.displayName)}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{student.displayName}</p>
                  <p className="text-sm text-gray-500">{student.email}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}