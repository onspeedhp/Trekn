import React from 'react'
import { useParams } from 'react-router';

export default function Links() {
    const { id } = useParams();
    window.location.href = `trekn://friend/${id}`
    return (
        <div>Links</div>
    )
}
