package com.example.arken.fragment;

import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;

import androidx.activity.OnBackPressedCallback;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.widget.Toolbar;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import androidx.navigation.Navigation;
import androidx.recyclerview.widget.RecyclerView;

import com.example.arken.R;
import com.example.arken.activity.MainActivity;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;

import static android.content.Context.MODE_PRIVATE;
import static androidx.navigation.fragment.NavHostFragment.findNavController;
import static com.example.arken.fragment.LoginFragment.MY_PREFS_NAME;

public class BaseFragment extends Fragment {
    private ImageButton eventPage;
    private ImageButton signOut;
    private Fragment fragment;
    private boolean isLogged = true;
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_base, container, false);
        FragmentManager f = getChildFragmentManager();
        OnBackPressedCallback callback = new OnBackPressedCallback(true ) {
            @Override
            public void handleOnBackPressed() {
                if(findNavController(fragment).getCurrentDestination().getId() == R.id.eventListFragment && isLogged){
                    AlertDialog.Builder builder1 = new AlertDialog.Builder(getContext());
                    builder1.setMessage("You are about to log out! Do you want to go on with this action?");
                    builder1.setCancelable(true);

                    builder1.setPositiveButton(
                            "Yes",
                            new DialogInterface.OnClickListener() {
                                public void onClick(DialogInterface dialog, int id) {
                                    dialog.cancel();
                                    signOut();
                                }
                            });

                    builder1.setNegativeButton(
                            "No",
                            new DialogInterface.OnClickListener() {
                                public void onClick(DialogInterface dialog, int id) {
                                    dialog.cancel();
                                }
                            });

                    AlertDialog alert11 = builder1.create();
                    alert11.show();
                }
                else{
                    if(Navigation.findNavController(signOut).getCurrentDestination().getId() == R.id.baseFragment)
                        Navigation.findNavController(signOut).popBackStack();
                }
            }
        };
        requireActivity().getOnBackPressedDispatcher().addCallback(this, callback);
        fragment = f.findFragmentById(R.id.nav_host_base_fragment);
        eventPage = view.findViewById(R.id.menu_event);
        eventPage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(findNavController(fragment).getCurrentDestination().getId() == R.id.eventListFragment){
                    RecyclerView recyclerView = fragment.getView().findViewById(R.id.recyclerView);
                    recyclerView.smoothScrollToPosition(0);
                }else if(findNavController(fragment).getCurrentDestination().getId() == R.id.eventFragment){
                    findNavController(fragment).popBackStack();
                }
            }
        });
        signOut = view.findViewById(R.id.menu_logout);
        final SharedPreferences prefs = getActivity().getSharedPreferences(MY_PREFS_NAME, MODE_PRIVATE);
        String email = prefs.getString("email", "default");//"No name defined" is the default value.
        if(GoogleSignIn.getLastSignedInAccount(getContext()) == null && email.equals("default")){
            signOut.setVisibility(View.GONE);
            isLogged = false;
        }
        signOut.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                signOut();
            }
        });

        return view;
    }
    private void signOut(){
        MainActivity.getClient().signOut().addOnCompleteListener(new OnCompleteListener<Void>() {
            @Override
            public void onComplete(@NonNull Task<Void> task) {
                SharedPreferences.Editor editor = getActivity().getSharedPreferences(MY_PREFS_NAME, MODE_PRIVATE).edit();
                editor.clear();
                editor.apply();
                if(Navigation.findNavController(signOut).getCurrentDestination().getId() == R.id.baseFragment)
                    Navigation.findNavController(signOut).popBackStack();

            }
        });
    }
}
