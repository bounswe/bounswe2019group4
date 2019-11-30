package com.example.arken.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.DialogFragment
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.model.FollowRequest
import com.example.arken.util.RequestAdapter

class PendingUserDialog(
    val requests: MutableList<FollowRequest>,
    val profileFragment: ProfileFragment,
    val mode: Int
) : DialogFragment() {

    lateinit var recyclerView: RecyclerView

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val rootView = inflater.inflate(R.layout.dialog_pending_request, container)
        recyclerView = rootView.findViewById(R.id.pending_recyclerView)
        recyclerView.adapter = RequestAdapter(requests, profileFragment, mode)

        this.dialog?.setTitle("Pending Requests")

        return rootView
    }

    fun removeAt(position: Int) {
        val reqAdapter = recyclerView.adapter as RequestAdapter
        reqAdapter.removeAt(position)
        recyclerView.adapter?.notifyDataSetChanged()
        if ((recyclerView.adapter as RequestAdapter).itemCount == 0) {
            dialog?.cancel()
        }
    }

}