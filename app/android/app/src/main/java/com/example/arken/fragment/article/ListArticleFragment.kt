package com.example.arken.fragment.article

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.navigation.Navigation
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.fragment.signup_login.LoginFragment
import com.example.arken.model.Article
import com.example.arken.model.ListArticle
import com.example.arken.model.Profile
import com.example.arken.util.ArticleAdapter
import com.example.arken.util.OnArticleClickListener
import com.example.arken.util.RetroClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response


class ListArticleFragment : Fragment(), OnArticleClickListener {

    val args: ListArticleFragmentArgs by navArgs()
    private lateinit var currentLayoutManagerType: LayoutManagerType
    private lateinit var recyclerView: RecyclerView
    private var dataset: MutableList<Article>? = mutableListOf()
    private lateinit var articleAdapter: ArticleAdapter
    private lateinit var createArticleButton: Button
    private lateinit var layoutManager: RecyclerView.LayoutManager

    enum class LayoutManagerType { GRID_LAYOUT_MANAGER, LINEAR_LAYOUT_MANAGER }
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        val rootView =
            inflater.inflate(R.layout.fragment_listarticle, container, false).apply {
                tag =
                    TAG
            }

        recyclerView = rootView.findViewById(R.id.articleRecyclerView)
        createArticleButton = rootView.findViewById(R.id.articleCreate)
        createArticleButton.setOnClickListener {
            Navigation.findNavController(rootView)
                .navigate(R.id.action_listArticleFragment_to_articleDialogFragment)
        }

        layoutManager = LinearLayoutManager(activity)

        currentLayoutManagerType =
            LayoutManagerType.LINEAR_LAYOUT_MANAGER

        if (savedInstanceState != null) {

            currentLayoutManagerType = savedInstanceState
                .getSerializable(KEY_LAYOUT_MANAGER) as LayoutManagerType
        }
        setRecyclerViewLayoutManager(currentLayoutManagerType)



        articleAdapter = ArticleAdapter( this)
        recyclerView.adapter = articleAdapter
        articleAdapter.notifyDataSetChanged()

        setRecyclerViewLayoutManager(LayoutManagerType.LINEAR_LAYOUT_MANAGER)


        return rootView
    }


    private fun setRecyclerViewLayoutManager(layoutManagerType: LayoutManagerType) {
        var scrollPosition = 0

        // If a layout manager has already been set, get current scroll position.
        if (recyclerView.layoutManager != null) {
            scrollPosition = (recyclerView.layoutManager as LinearLayoutManager)
                .findFirstCompletelyVisibleItemPosition()
        }

        layoutManager = LinearLayoutManager(activity)
        currentLayoutManagerType =
            LayoutManagerType.LINEAR_LAYOUT_MANAGER


        with(recyclerView) {
            layoutManager = this@ListArticleFragment.layoutManager
            scrollToPosition(scrollPosition)
        }

    }

    override fun onSaveInstanceState(savedInstanceState: Bundle) {


        savedInstanceState.putSerializable(KEY_LAYOUT_MANAGER, currentLayoutManagerType)
        super.onSaveInstanceState(savedInstanceState)
    }

    companion object {
        private val TAG = "RecyclerViewFragment"
        private val KEY_LAYOUT_MANAGER = "layoutManager"
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val userId = activity!!.getSharedPreferences(
            LoginFragment.MY_PREFS_NAME,
            Context.MODE_PRIVATE
        ).getString("userId", "")!!
        if(args.profile!=null){
        if (userId!=args.profile?.user!!._id){
            createArticleButton.visibility=View.GONE
        }}
    }
    override fun onArticleItemClicked(id: String) {
        val action =
            ListArticleFragmentDirections.actionListArticleFragmentToArticleDetail(
                id
            )
        Navigation.findNavController(recyclerView).navigate(action)
    }

    override fun onResume() {
        super.onResume()
        if(args.profile==null){
getArticlesAll()
        }else{
        getProfile()}
    }

    fun getProfile() {

        val userCookie = activity!!.getSharedPreferences(
            LoginFragment.MY_PREFS_NAME,
            Context.MODE_PRIVATE
        )
            .getString("user_cookie", "")
        val call: Call<Profile> =
            RetroClient.getInstance().apiService.getProfile(userCookie, args.profile!!.user!!._id)

        call.enqueue(object : Callback<Profile> {
            override fun onResponse(call: Call<Profile>, response: Response<Profile>) {
                if (response.isSuccessful) {
                    val profile = response.body()!!
                    dataset=profile.articles as MutableList<Article>
                    articleAdapter.dataSet=dataset!!
                    articleAdapter.notifyDataSetChanged()
                } else {
                    Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<Profile>, t: Throwable) {
                Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
            }
        })

    }

    fun getArticlesAll(){
        val call: Call<ListArticle> =
            RetroClient.getInstance().apiService.getArticles(1,10)

        call.enqueue(object : Callback<ListArticle> {
            override fun onResponse(call: Call<ListArticle>, response: Response<ListArticle>) {
                if (response.isSuccessful) {
                    val listArticle = response.body()!!
                    dataset=listArticle.articles as MutableList<Article>
                    articleAdapter.dataSet=dataset!!
                    articleAdapter.totalPages = listArticle.totalNumberOfPages!!
                    articleAdapter.page = 1
                    articleAdapter.notifyDataSetChanged()
                } else {
                    Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<ListArticle>, t: Throwable) {
                Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
            }
        })
    }
}
